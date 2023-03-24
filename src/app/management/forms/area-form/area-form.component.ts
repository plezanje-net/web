import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Apollo } from 'apollo-angular';
import { AuthService } from 'src/app/auth/auth.service';
import {
  Area,
  ManagementCreateAreaGQL,
  ManagementUpdateAreaGQL,
} from 'src/generated/graphql';

interface AresFormComponentData {
  area?: Area;
  countryId?: string;
}

@Component({
  selector: 'app-area-form',
  templateUrl: './area-form.component.html',
  styleUrls: ['./area-form.component.scss'],
})
export class AreaFormComponent implements OnInit {
  saving = false;

  form = new FormGroup({
    name: new FormControl(''),
  });

  constructor(
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) private data: AresFormComponentData,
    private createGQL: ManagementCreateAreaGQL,
    private updateGQL: ManagementUpdateAreaGQL,
    private apollo: Apollo,
    private dialogRef: MatDialogRef<AreaFormComponent>,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.data?.area != null) {
      this.form.patchValue(this.data.area);
    }
  }

  save() {
    this.saving = true;

    const success = () => {
      this.apollo.client.resetStore().then(() => {
        this.saving = false;
        this.dialogRef.close();
      });
    };
    const error = () => {
      this.snackbar.open('Pri shranjevanju je prišlo do napake', null, {
        panelClass: 'error',
        duration: 3000,
      });
      this.saving = false;
    };

    if (this.data.area != null) {
      this.updateGQL
        .mutate({
          input: {
            ...this.form.value,
            id: this.data.area.id,
            countryId: this.data.countryId,
          },
        })
        .subscribe({
          next: success,
          error: error,
        });
    } else {
      this.createGQL
        .mutate({
          input: {
            ...this.form.value,
            countryId: this.data.countryId,
          },
        })
        .subscribe({
          next: success,
          error: error,
        });
    }
  }
}
