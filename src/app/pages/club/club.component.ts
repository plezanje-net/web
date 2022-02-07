import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GraphQLError } from 'graphql';
import { ClubMemberFormComponent } from 'src/app/forms/club-member-form/club-member-form.component';
import { ClubFormComponent } from 'src/app/forms/club-form/club-form.component';
import { LayoutService } from 'src/app/services/layout.service';
import { DataError } from 'src/app/types/data-error';
import { Club } from 'src/generated/graphql';
import { ClubService } from './club.service';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { filter, mergeMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteClubGQL } from '../../../generated/graphql';

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.scss'],
  providers: [ClubService],
})
export class ClubComponent implements OnInit, OnDestroy {
  loading = true;
  error: DataError = null;

  club: Club;

  clubSubscription: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    public clubService: ClubService,
    private deleteClubGQL: DeleteClubGQL
  ) {}

  ngOnInit(): void {
    const clubSlug = this.activatedRoute.snapshot.params.club;
    this.clubService.fetchClub(clubSlug);

    this.clubSubscription = this.clubService.club$.subscribe({
      next: (club: Club) => {
        this.loading = false;
        this.club = club;
        this.setBreadcrumbs();
      },
      error: (errors) => {
        this.loading = false;
        this.queryError(errors);
      },
    });
  }

  queryError(errors: readonly GraphQLError[] = []) {
    if (
      errors.length > 0 &&
      errors[0].message.startsWith('Could not find any entity of type')
    ) {
      this.error = {
        message: 'Klub ne obstaja.',
      };
    } else if (errors.length > 0 && errors[0].message === 'Forbidden') {
      this.error = {
        message:
          'Nisi član kluba, zato nimaš pravic za prikaz podatkov o klubu.',
      };
    } else {
      this.error = {
        message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
      };
    }
  }

  setBreadcrumbs() {
    this.layoutService.$breadcrumbs.next([
      {
        name: 'Moj Profil',
        path: '/moj-profil',
      },
      {
        name: 'Moji Klubi',
        path: '/moj-profil/moji-klubi',
      },
      {
        name: this.club.name,
      },
    ]);
  }

  addMember() {
    this.dialog
      .open(ClubMemberFormComponent, {
        data: {
          clubId: this.club.id,
          clubName: this.club.name,
          club: this.club,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.clubService.refetchClub();
          this.clubService.memberAdded$.next();
        }
      });
  }

  updateName() {
    this.dialog
      .open(ClubFormComponent, {
        data: { id: this.club.id, currentName: this.club.name },
      })
      .afterClosed()
      .subscribe((newSlug) => {
        this.clubService.refetchClub(newSlug);
      });
  }

  delete() {
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          message:
            'Ali res želiš odstraniti vse člane iz kluba in izbrisati klub?',
        },
      })
      .afterClosed()
      .pipe(
        filter((result) => !!result),
        mergeMap(() => {
          return this.deleteClubGQL.mutate(
            { id: this.club.id },
            {
              update: (cache) => {
                cache.evict({
                  id: 'ROOT_QUERY',
                  fieldName: 'myClubs',
                });
              },
            }
          );
        })
      )
      .subscribe({
        next: (data) => {
          if (data.errors != null) {
            this.queryError(data.errors);
          } else {
            this.displaySuccess();
            this.router.navigate(['/moj-profil/moji-klubi']);
          }
        },
        error: () => {
          this.queryError();
        },
      });
  }

  displayError(errorMessage: string) {
    this.snackbar.open(errorMessage, null, {
      panelClass: 'error',
      duration: 3000,
    });
  }

  displaySuccess() {
    this.snackbar.open(
      'Vsi člani so bili odstranjen iz kluba in klub je bil uspešno izbrisan.',
      null,
      {
        duration: 3000,
      }
    );
  }

  ngOnDestroy() {
    this.clubSubscription.unsubscribe();
  }
}
