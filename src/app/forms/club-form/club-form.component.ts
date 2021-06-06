import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GraphQLError } from 'graphql';
import { namedOperations, UpdateClubGQL } from 'src/generated/graphql';

@Component({
  selector: 'app-club-form',
  templateUrl: './club-form.component.html',
  styleUrls: ['./club-form.component.scss'],
})
export class ClubFormComponent implements OnInit {
  clubForm = new FormGroup({
    name: new FormControl(this.data.currentName, [Validators.required]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: string; currentName: string },
    private updateClubGQL: UpdateClubGQL,
    private dialogRef: MatDialogRef<ClubFormComponent>,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    const newName = this.clubForm.value.name;
    const updateClubInput = {
      id: this.data.id,
      name: newName,
    };

    this.updateClubGQL
      .mutate(
        { input: updateClubInput },
        { errorPolicy: 'all', refetchQueries: [namedOperations.Query.ClubById] }
      )
      .subscribe((result) => {
        if (result.errors != null) {
          this.queryError(result.errors);
        } else {
          this.displaySuccess();
        }
        this.dialogRef.close();
      });
  }

  queryError(errors: readonly GraphQLError[]) {
    if (
      errors.length > 0 &&
      errors[0].message.startsWith('Could not find any entity of type')
    ) {
      this.displayError('Klub ni bil najden.');
    } else if (errors.length > 0 && errors[0].message === 'Forbidden') {
      this.displayError(
        'Samo administratorji kluba lahko spremenijo ime kluba.'
      );
    } else {
      this.displayError();
    }
  }

  displayError(errorMessage = 'Prišlo je do nepričakovane napake.') {
    this.snackbar.open(errorMessage, null, {
      panelClass: 'error',
      duration: 3000,
    });
  }

  displaySuccess() {
    this.snackbar.open('Ime kluba je bilo uspešno spremenjeno.', null, {
      duration: 3000,
    });
  }
}
