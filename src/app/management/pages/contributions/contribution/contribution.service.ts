import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '@sentry/angular';
import { concatMap, of, Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import {
  Crag,
  ManagementUpdateCragGQL,
  ManagementUpdateRouteGQL,
  ManagementUpdateSectorGQL,
  Route,
  Sector,
} from 'src/generated/graphql';
import { PublishStatusChangeDialogComponent } from '../publish-status-change-dialog/publish-status-change-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ContributionService {
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

  private publishStatusChanged = new Subject<string>();
  publishStatusChanged$ = this.publishStatusChanged.asObservable();

  constructor(
    private managementUpdateRouteGQL: ManagementUpdateRouteGQL,
    private managementUpdateSectorGQL: ManagementUpdateSectorGQL,
    private managementUpdateCragGQL: ManagementUpdateCragGQL,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.authService.currentUser.subscribe((user) => {
      this.user = user;
    });
  }

  /**
   * Determine what the next publishStatus of the entity contribution can be.
   * Based on publishStatus of the parent also determine if moving to that status is currently enabled
   */
  nextPossiblePublishStatuses(
    contributionEntity: Route | Sector | Crag
  ): { enabled: boolean; status: string }[] {
    if (!contributionEntity) {
      return null;
    }

    // An admin can publish her own drafts directly
    // draft --> published
    if (
      this.user.roles.includes('admin') &&
      contributionEntity.publishStatus === 'draft' &&
      contributionEntity.user.id === this.user.id
    ) {
      // entity can be published only if parent entity is already published
      let enabled = false;
      switch (contributionEntity.__typename) {
        case 'Route':
          enabled = contributionEntity.sector.publishStatus === 'published';
          break;
        case 'Sector':
          enabled = contributionEntity.crag.publishStatus === 'published';
          break;
        case 'Crag':
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
      contributionEntity.publishStatus === 'in_review'
    ) {
      // entity can be published only if parent entity is already published
      let publishEnabled = false;
      switch (contributionEntity.__typename) {
        case 'Route':
          publishEnabled =
            contributionEntity.sector.publishStatus === 'published';
          break;
        case 'Sector':
          publishEnabled =
            contributionEntity.crag.publishStatus === 'published';

          break;
        case 'Crag':
          publishEnabled = true;
          break;
      }

      // entity can be denied even if not all child entities are already denied. Cascading status change will be forced
      return [
        { status: 'published', enabled: publishEnabled },
        { status: 'draft', enabled: true },
      ];
    }

    // A regular user can mark her own contributions as ready for review
    // draft --> in_review
    if (
      contributionEntity.publishStatus === 'draft' &&
      contributionEntity.user.id === this.user.id // redundant check, cause BE should filter, but keeep for consistency
    ) {
      // entity can be pushed to review only if parent entity is already in_review or published
      let enabled = false;
      switch (contributionEntity.__typename) {
        case 'Route':
          enabled = ['published', 'in_review'].includes(
            contributionEntity.sector.publishStatus
          );
          break;
        case 'Sector':
          enabled = ['published', 'in_review'].includes(
            contributionEntity.crag.publishStatus
          );
          break;
        case 'Crag':
          enabled = true;
          break;
      }
      return [{ status: 'in_review', enabled }];
    }

    // if none of the above, status changes are not possible
    return null;
  }

  /**
   * Helper function needed to ngFor across buttons
   */
  statusButtonsTrackBy = (item: { status: string; enabled: boolean }) =>
    item.status + item.enabled;

  /**
   * Open popup, ask for confirmation and cascade option, then mutate the publishStatus
   */
  updatePublishStatus(
    contributionEntity: Route | Sector | Crag,
    newStatus: string
  ) {
    let updateEntityGQL = null;
    let cascadeMessage = null;
    let forceCascade = false;

    switch (contributionEntity.__typename) {
      case 'Route':
        updateEntityGQL = this.managementUpdateRouteGQL;
        break;
      case 'Sector':
        updateEntityGQL = this.managementUpdateSectorGQL;

        // As soon as an unpublished entity has children we can infer that they are all unpublished as well (because a child cannot be published before it's parent)
        if (newStatus === 'in_review' && contributionEntity.routes.length) {
          cascadeMessage = 'Predlagaj tudi objavo vseh smeri v tem sektorju.';
        }
        if (newStatus === 'published' && contributionEntity.routes.length) {
          cascadeMessage = 'Objavi tudi vse smeri v tem sektorju.';
        }
        // If a contribution is being rejected and has children, cascading status change should be forced (this can only be editor's actiom)
        if (newStatus === 'draft' && contributionEntity.routes.length) {
          cascadeMessage = 'Zavrni tudi vse smeri v tem sektorju.';
          forceCascade = true;
        }
        break;

      case 'Crag':
        updateEntityGQL = this.managementUpdateCragGQL;

        if (newStatus === 'in_review' && contributionEntity.sectors.length) {
          cascadeMessage =
            'Predlagaj tudi objavo vseh sektorjev v tem plezališču.';

          if (
            contributionEntity.sectors.some((sector) => sector.routes.length)
          ) {
            cascadeMessage =
              'Predlagaj tudi objavo vseh sektorjev in vseh smeri v tem plezališču.';
          }
        }

        if (newStatus === 'published' && contributionEntity.sectors.length) {
          cascadeMessage = 'Objavi tudi vse sektorje v tem plezališču.';
          if (
            contributionEntity.sectors.some((sector) => sector.routes.length)
          ) {
            cascadeMessage =
              'Objavi tudi vse sektorje in vse smeri v tem plezališču.';
          }
        }

        if (newStatus === 'draft' && contributionEntity.sectors.length) {
          cascadeMessage = 'Zavrni tudi vse sektorje v tem plezališču.';
          if (
            contributionEntity.sectors.some((sector) => sector.routes.length)
          ) {
            cascadeMessage =
              'Zavrni tudi vse sektorje in vse smeri v tem plezališču.';
          }
          forceCascade = true;
        }
        break;
    }

    if (updateEntityGQL !== null) {
      // Open dialog, make user confirm status change, let user choose cascade if applicable, let admin add rejection explanation if applicable
      this.dialog
        .open(PublishStatusChangeDialogComponent, {
          data: { cascadeMessage, newStatus, forceCascade },
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
                  id: contributionEntity.id,
                  publishStatus: newStatus,
                  rejectionMessage,
                },
                ...(contributionEntity.__typename !== 'Route' && {
                  cascadePublishStatus: cascade,
                }),
              },
            });
          })
        )
        .subscribe({
          next: (response) => {
            if (response) {
              this.publishStatusChanged.next(newStatus);
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
