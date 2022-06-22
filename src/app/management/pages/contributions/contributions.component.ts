import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import {
  Contribution,
  ManagementContributionsGQL,
  ManagementUpdateCragGQL,
  ManagementUpdateRouteGQL,
  ManagementUpdateSectorGQL,
  User,
} from 'src/generated/graphql';

@Component({
  selector: 'app-contributions',
  templateUrl: './contributions.component.html',
  styleUrls: ['./contributions.component.scss'],
})
export class ContributionsComponent implements OnInit {
  loading = true;
  error = false;

  contributions: Contribution[];

  entityNames = {
    crag: 'Plezališče',
    sector: 'Sektor',
    route: 'Smer',
  };

  publishStatuses = {
    draft: {
      value: 'draft',
      statusLabel: 'osnutek',
      actionLabel: 'Zavrni',
      successMessage: 'Predlog je bil zavrnjen.',
    },
    in_review: {
      value: 'in_review',
      statusLabel: 'v pregledu',
      actionLabel: 'Predlagaj objavo',
      successMessage: 'Predlog za objavo je bil poslan uredništvu.',
    },
    published: {
      value: 'published',
      statusLabel: 'objavljeno',
      actionLabel: 'Objavi',
      successMessage: 'Prispevek je bil objavljen.',
    },
  };
  user: User;

  constructor(
    private authService: AuthService,
    private managementContributionsGQL: ManagementContributionsGQL,
    private managementUpdateRouteGQL: ManagementUpdateRouteGQL,
    private managementUpdateSectorGQL: ManagementUpdateSectorGQL,
    private managementUpdateCragGQL: ManagementUpdateCragGQL,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.authService.currentUser
      .pipe(
        switchMap((user) => {
          this.user = user;
          return this.managementContributionsGQL.watch().valueChanges;
        })
      )
      .subscribe({
        next: (response) => {
          this.contributions = <Contribution[]>response.data.contributions;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.error = true;
        },
      });
  }

  /**
   * Determine what the next publishStatus of the entity contribution can be.
   * Based on publishStatus of the parent also determine if moving to that status is enabled
   */
  nextPossibleStatuses(
    contribution: Contribution
  ): { enabled: boolean; status: string }[] {
    // An admin can publish her own drafts directly
    // draft --> published
    if (
      this.user.roles.includes('admin') &&
      contribution.publishStatus === 'draft' &&
      contribution.user.id === this.user.id
    ) {
      // entity can be published only if parent entity is already published
      let enabled = false;
      switch (contribution.entity) {
        case 'route':
          enabled = contribution.route.sector.publishStatus === 'published';
          break;
        case 'sector':
          enabled = contribution.sector.crag.publishStatus === 'published';
          break;
        case 'crag':
          enabled = true;
          break;
      }

      return [{ status: 'published', enabled }];
    }

    // An admin can publish other users' contributions that are marked as ready for review or she can deny them
    // in_review --> published
    // in_review --> draft
    if (
      this.user.roles.includes('admin') &&
      contribution.publishStatus === 'in_review'
    ) {
      // entity can be published only if parent entity is already published
      let publishEnabled = false;
      switch (contribution.entity) {
        case 'route':
          publishEnabled =
            contribution.route.sector.publishStatus === 'published';
          break;
        case 'sector':
          console.log(contribution);
          publishEnabled =
            contribution.sector.crag.publishStatus === 'published';
          break;
        case 'crag':
          publishEnabled = true;
          break;
      }

      // entity can be denied only if all child entities are already denied
      let draftEnabled = false;
      switch (contribution.entity) {
        case 'route':
          draftEnabled = true;
          break;
        case 'sector':
          draftEnabled = contribution.sector.routes.every(
            (route) => route.publishStatus === 'draft'
          );
          break;
        case 'crag':
          draftEnabled = contribution.crag.sectors.every(
            (sector) => sector.publishStatus === 'draft'
          );
          break;
      }

      return [
        { status: 'published', enabled: publishEnabled },
        { status: 'draft', enabled: draftEnabled },
      ];
    }

    // A regular user can mark her owm contributions as ready for review
    // draft --> in_review
    if (
      contribution.publishStatus === 'draft' &&
      contribution.user.id === this.user.id // redundant check, cause BE should filter, but keeep for consistency
    ) {
      let enabled = false;
      switch (contribution.entity) {
        case 'route':
          enabled = ['published', 'in_review'].includes(
            contribution.route.sector.publishStatus
          );
          break;
        case 'sector':
          enabled = ['published', 'in_review'].includes(
            contribution.sector.crag.publishStatus
          );
          break;
        case 'crag':
          enabled = true;
          break;
      }
      return [{ status: 'in_review', enabled }];
    }

    // if none of the above, status changes are not possible
    return null;
  }

  statusButtonsTrackBy = (item: { status: string; enabled: boolean }) =>
    item.status + item.enabled;

  updateStatus(entity: string, entityId: string, newStatus: string) {
    let updateEntityGQL = null;
    switch (entity) {
      case 'route':
        updateEntityGQL = this.managementUpdateRouteGQL;
        break;
      case 'sector':
        updateEntityGQL = this.managementUpdateSectorGQL;
        break;
      case 'crag':
        updateEntityGQL = this.managementUpdateCragGQL;
        break;
    }

    if (updateEntityGQL !== null) {
      updateEntityGQL
        .mutate({ input: { id: entityId, publishStatus: newStatus } })
        .subscribe({
          next: () => {
            this.displaySuccess(this.publishStatuses[newStatus].successMessage);
          },
          error: () => {
            this.displayError();
          },
        });
    }
  }

  private displayError() {
    this.snackbar.open(
      'Pri obdelavi zahteve je prišlo do nepričakovane napake.',
      null,
      {
        panelClass: 'error',
        duration: 3000,
      }
    );
  }

  private displaySuccess(successMessage: string) {
    this.snackbar.open(successMessage, null, {
      duration: 3000,
    });
  }
}
