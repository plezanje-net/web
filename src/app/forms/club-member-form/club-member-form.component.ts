import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApolloError } from '@apollo/client/errors';
import { GraphQLError } from 'graphql';
import { Club, CreateClubMemberByEmailGQL } from '../../../generated/graphql';

@Component({
  selector: 'app-club-member-form',
  templateUrl: './club-member-form.component.html',
  styleUrls: ['./club-member-form.component.scss'],
})
export class ClubMemberFormComponent implements OnInit {
  addMemberForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    admin: new FormControl(false),
  });
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { clubId: string; clubName: string; club: Club },
    private dialogRef: MatDialogRef<ClubMemberFormComponent>,
    private snackbar: MatSnackBar,
    private createClubMemberByEmailGQL: CreateClubMemberByEmailGQL
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    const email = this.addMemberForm.value.email;
    const admin = this.addMemberForm.value.admin;

    this.createClubMemberByEmailGQL
      .mutate(
        {
          input: {
            admin: admin,
            userEmail: email,
            clubId: this.data.clubId,
          },
        },
        {
          update: (cache) => {
            cache.evict({
              id: cache.identify(this.data.club),
            });

            // remove from cache all queries on activityRoutes for club members - will need to fetch again because we have a new member
            cache.evict({
              id: 'ROOT_QUERY',
              fieldName: 'activityRoutesByClubSlug',
            });
          },
        }
      )
      .subscribe(
        (result: any) => {
          if (result.errors != null) {
            this.queryError(result.errors);
          } else {
            this.querySuccess(result.data);
          }
        },
        (error: ApolloError) => {
          this.displayError();
        }
      );
  }

  queryError(errors: GraphQLError[]) {
    if (
      errors.length > 0 &&
      errors[0].message.startsWith('Could not find any entity of type')
    ) {
      this.displayError('Uporabnik s tem e-poštnim naslovom ni bil najden.');
    } else if (
      errors.length > 0 &&
      errors[0].message.startsWith(
        'duplicate key value violates unique constraint'
      )
    ) {
      this.displayError('Uporabnik s tem e-poštnim naslovom je že član kluba.');
    } else if (errors.length > 0 && errors[0].message === 'Forbidden') {
      // should not really happen, because only club admins should see the option for adding members
      this.displayError('Samo administratorji kluba lahko dodajajo člane.');
    } else {
      this.displayError();
    }
    this.dialogRef.close(false);
  }

  querySuccess(data) {
    this.displaySuccess();
    this.dialogRef.close(true);
  }

  displaySuccess() {
    this.snackbar.open(
      'Uporabnik je bil uspešno dodan med člane kluba.',
      null,
      {
        duration: 3000,
      }
    );
  }

  displayError(errorMessage = 'Prišlo je do nepričakovane napake.') {
    this.snackbar.open(errorMessage, null, {
      panelClass: 'error',
      duration: 3000,
    });
  }
}
