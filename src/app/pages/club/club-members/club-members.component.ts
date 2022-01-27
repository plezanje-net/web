import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GraphQLError } from 'graphql';
import {
  Club,
  DeleteClubMemberGQL,
  namedOperations,
} from 'src/generated/graphql';
import { Observable, Subscription, take } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { ClubService } from '../club.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-club-members',
  templateUrl: './club-members.component.html',
  styleUrls: ['./club-members.component.scss'],
})
export class ClubMembersComponent implements OnInit, OnDestroy {
  loading = true;
  club$: Observable<Club>;
  meId: string;

  subscription: Subscription;

  constructor(
    private clubService: ClubService,
    private authService: AuthService,
    private deleteClubMemberGQL: DeleteClubMemberGQL,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.club$ = this.clubService.club$;

    this.subscription = this.authService.currentUser.subscribe(
      (user) => (this.meId = user ? user.id : null)
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  deleteMember(id: string, memberFullName: string) {
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          message: `Ali res želiš odstraniti člana ${memberFullName} iz kluba?`,
        },
      })
      .afterClosed()
      .pipe(
        filter((result) => !!result),
        mergeMap((_) => {
          return this.deleteClubMemberGQL.mutate(
            { id },
            {
              refetchQueries: [namedOperations.Query.ClubBySlug], // list of members on club members view will change
              update: (cache) => {
                // on myClubs view number of members will change
                cache.evict({
                  id: 'ROOT_QUERY',
                  fieldName: 'myClubs',
                });

                // remove from cache all queries on activityRoutes for club members - will need to fetch again because we lost a member
                cache.evict({
                  id: 'ROOT_QUERY',
                  fieldName: 'activityRoutesByClubSlug',
                });
              },
            }
          );
        })
      )
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          if (data.errors != null) {
            this.queryError(data.errors);
          } else {
            this.displaySuccess();
          }
        },
        error: () => {
          this.queryError();
        },
      });
  }

  queryError(errors?: readonly GraphQLError[]) {
    let errorMessage = 'Prišlo je do nepričakovane napake.'; // set default error message
    if (errors && errors.length > 0 && errors[0].message === 'Forbidden')
      errorMessage = 'Nimaš pravic za odstranjevanje članov.';
    this.displayError(errorMessage);
  }

  displayError(errorMessage: string) {
    this.snackbar.open(errorMessage, null, {
      panelClass: 'error',
      duration: 3000,
    });
  }

  displaySuccess() {
    this.snackbar.open('Član je bil uspešno odstranjen iz kluba.', null, {
      duration: 3000,
    });
  }
}
