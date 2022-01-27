import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GraphQLError } from 'graphql';
import { UpdateClubGQL, CreateClubGQL } from 'src/generated/graphql';

@Component({
  selector: 'app-club-form',
  templateUrl: './club-form.component.html',
  styleUrls: ['./club-form.component.scss'],
})
export class ClubFormComponent implements OnInit {
  title: string;
  clubForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id?: string; currentName?: string },
    private updateClubGQL: UpdateClubGQL,
    private createClubGQL: CreateClubGQL,
    public dialogRef: MatDialogRef<ClubFormComponent>,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.title = 'Spremeni ime kluba';
      this.clubForm.patchValue({ name: this.data.currentName });
    } else {
      this.title = 'Ustvari nov klub';
    }
  }

  onSubmit() {
    if (this.data) {
      this.updateClub();
    } else {
      this.createClub();
    }
  }

  updateClub() {
    const newName = this.clubForm.value.name;
    const updateClubInput = {
      id: this.data.id,
      name: newName,
    };

    this.updateClubGQL
      .mutate({ input: updateClubInput })
      .subscribe((result) => {
        if (result.errors != null) {
          this.queryError(result.errors);
        } else {
          this.router.navigate([
            '/moj-profil/moji-klubi',
            result.data.updateClub.slug,
          ]);

          this.displaySuccess('Ime kluba je bilo uspešno spremenjeno.');
        }
        this.dialogRef.close(result.data.updateClub.slug);
      });
  }

  createClub() {
    const name = this.clubForm.value.name;

    this.createClubGQL.mutate({ input: { name } }).subscribe((result) => {
      if (result.errors != null) {
        this.queryError(result.errors);
      } else {
        this.displaySuccess('Nov klub je bil ustvarjen.');
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
    } else if (
      errors.length > 0 &&
      errors[0].message.startsWith(
        'duplicate key value violates unique constraint'
      )
    ) {
      this.displayError('Klub s tem imenom že obstaja.');
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

  displaySuccess(successMessage: string) {
    this.snackbar.open(successMessage, null, {
      duration: 3000,
    });
  }
}
