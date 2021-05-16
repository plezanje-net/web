import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApolloError } from '@apollo/client/errors';
import { Apollo, gql } from 'apollo-angular';
import { GraphQLError } from 'graphql';

const GET_USER = gql`
  query getUser($email: String!) {
    user(email: $email) {
      id
      fullName
    }
  }
`;

// export type CreateClubMemberInput = {
//   admin: Scalars['Boolean'];
//   userId: Scalars['String'];
//   clubId: Scalars['String'];
// };

const ADD_MEMBER = gql`
  mutation addMember($input: CreateClubMemberInput!) {
    createClubMember(input: $input) {
      id
    }
  }
`;

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
    @Inject(MAT_DIALOG_DATA) public data: { clubId: string; clubName: string },
    private dialogRef: MatDialogRef<ClubMemberFormComponent>,
    private snackbar: MatSnackBar,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    const email = this.addMemberForm.value.email;
    const admin = this.addMemberForm.value.admin;

    // TODO: should BE be able to add member by passing userEmail instead of userId, so this could be done in a single request?

    // get user that we are trying to add
    this.apollo
      .watchQuery({ query: GET_USER, variables: { email } })
      .valueChanges.subscribe((result: any) => {
        if (result.errors != null) {
          this.queryError(result.errors);
          return;
        }

        // if user was found try adding her to the club
        const data = result.data;
        const user = data.user;
        const userId = user.id;
        this.apollo
          .mutate({
            mutation: ADD_MEMBER,
            errorPolicy: 'all',
            variables: {
              input: {
                admin: admin,
                userId: userId,
                clubId: this.data.clubId,
              },
            },
          })
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
      });
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
        panelClass: 'success',
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
