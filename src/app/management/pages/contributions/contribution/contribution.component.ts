import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '@sentry/angular';
import { concatMap, of, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import {
  Contribution,
  ManagementUpdateCragGQL,
  ManagementUpdateRouteGQL,
  ManagementUpdateSectorGQL,
} from 'src/generated/graphql';
import { PublishStatusChangeDialogComponent } from '../publish-status-change-dialog/publish-status-change-dialog.component';

@Component({
  selector: 'app-contribution',
  templateUrl: './contribution.component.html',
  styleUrls: ['./contribution.component.scss'],
})
export class ContributionComponent implements OnInit, OnDestroy {
  @Input() contribution: Contribution;
  @Input() link: string[];
  @Input() depth: number = 0;

  entityTypeLabel = { crag: 'Plezališče', sector: 'Sektor', route: 'Smer' };

  publishStatuses = {
    draft: {
      statusLabel: 'osnutek',
      actionLabel: 'Zavrni',
      successMessage: 'Predlog je bil zavrnjen.',
    },
    in_review: {
      statusLabel: 'v pregledu',
      actionLabel: 'Predlagaj objavo',
      successMessage: 'Predlog za objavo je bil poslan uredništvu.',
    },
    published: {
      statusLabel: 'objavljeno',
      actionLabel: 'Objavi',
      successMessage: 'Prispevek je bil objavljen.',
    },
  };

  user: User;
  subscription: Subscription;

  constructor(
    private authService: AuthService,
    private managementUpdateRouteGQL: ManagementUpdateRouteGQL,
    private managementUpdateSectorGQL: ManagementUpdateSectorGQL,
    private managementUpdateCragGQL: ManagementUpdateCragGQL,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.currentUser.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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

    // A regular user can mark her own contributions as ready for review
    // draft --> in_review
    if (
      contribution.publishStatus === 'draft' &&
      contribution.user.id === this.user.id // redundant check, cause BE should filter, but keeep for consistency
    ) {
      // entity can be pushed to review only if parent entity is already in_review or published
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

  updateStatus(contribution: Contribution, newStatus: string) {
    let updateEntityGQL = null;
    let cascadeMessage = null;

    switch (contribution.entity) {
      case 'route':
        updateEntityGQL = this.managementUpdateRouteGQL;
        break;
      case 'sector':
        updateEntityGQL = this.managementUpdateSectorGQL;

        // As soon as an unpublished entity has children we can infer that they are all unpublished as well (because a child cannot be published before it's parent)
        if (newStatus === 'in_review' && contribution.sector.routes.length) {
          cascadeMessage = 'Predlagaj tudi objavo vseh smeri v tem sektorju.';
        }
        if (newStatus === 'published' && contribution.sector.routes.length) {
          cascadeMessage = 'Objavi tudi vse smeri v tem sektorju.';
        }
        break;

      case 'crag':
        updateEntityGQL = this.managementUpdateCragGQL;

        if (newStatus === 'in_review' && contribution.crag.sectors.length) {
          cascadeMessage =
            'Predlagaj tudi objavo vseh sektorjev v tem plezališču.';

          if (
            contribution.crag.sectors.some((sector) => sector.routes.length)
          ) {
            cascadeMessage =
              'Predlagaj tudi objavo vseh sektorjev in vseh smeri v tem plezališču.';
          }
        }

        if (newStatus === 'published' && contribution.crag.sectors.length) {
          cascadeMessage = 'Objavi tudi vse sektorje v tem plezališču.';
          if (
            contribution.crag.sectors.some((sector) => sector.routes.length)
          ) {
            cascadeMessage =
              'Objavi tudi vse sektorje in vse smeri v tem plezališču.';
          }
        }
        break;
    }

    if (updateEntityGQL !== null) {
      // Open dialog, make user confirm status change, let user choose cascade if applicable, let admin add rejection explanation if applicable
      this.dialog
        .open(PublishStatusChangeDialogComponent, {
          data: { cascadeMessage, newStatus },
          width: '400px',
          maxWidth: '90vw',
          maxHeight: '90vh',
        })
        .afterClosed()
        .pipe(
          concatMap((dialogData) => {
            // user canceled or closed the dialog, in that case do nothing
            if (!dialogData) {
              return of(false);
            }

            const cascade = dialogData.cascade;
            const rejectionMessage = dialogData.rejectionMessage;

            return updateEntityGQL.mutate({
              input: {
                ...{
                  id: contribution[contribution.entity].id,
                  publishStatus: newStatus,
                  // rejectionMessage //TODO: add param when BE is ready
                },
                ...(contribution.entity !== 'route' && {
                  cascadePublishStatus: cascade,
                }),
              },
            });
          })
        )
        .subscribe({
          next: (response) => {
            if (response) {
              this.displaySuccess(
                this.publishStatuses[newStatus].successMessage
              );
            }
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
