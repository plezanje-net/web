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
   */
  nextPossibleStatuses(contribution: Contribution) {
    // An admin can publish her own drafts directly
    // draft --> published
    if (
      this.user.roles.includes('admin') &&
      contribution.publishStatus === 'draft' &&
      contribution.user.id === this.user.id
    ) {
      return ['published'];
    }

    // An admin can publish other users' contributions that are marked as ready for review
    // in_review --> published
    if (
      this.user.roles.includes('admin') &&
      contribution.publishStatus === 'in_review'
    ) {
      return ['published', 'draft'];
    }

    // A regular user can mark her owm contributions as ready for review
    // draft --> in_review
    if (
      contribution.publishStatus === 'draft' &&
      contribution.user.id === this.user.id // redundant check, cause BE should filter, but keeep for consistency
    ) {
      return ['in_review'];
    }

    // if none of the above, status changes are not possible
    return null;
  }

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
