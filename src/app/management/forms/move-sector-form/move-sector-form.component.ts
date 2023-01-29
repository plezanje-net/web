import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import {
  Crag,
  ManagementMoveSectorFormGetCragsGQL,
  ManagementMoveSectorToCragGQL,
  Sector,
} from 'src/generated/graphql';

export interface MoveSectorFormComponentData {
  sector: Sector;
  countrySlug: string;
}

@Component({
  selector: 'app-move-sector-form',
  templateUrl: './move-sector-form.component.html',
  styleUrls: ['./move-sector-form.component.scss'],
})
export class MoveSectorFormComponent implements OnInit, OnDestroy {
  crags: Crag[];
  saving = false;

  subscriptions: Subscription[] = [];

  form = new FormGroup({
    crag: new FormControl(null, Validators.required),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: MoveSectorFormComponentData,
    private cragsGQL: ManagementMoveSectorFormGetCragsGQL,
    private moveSectorGQL: ManagementMoveSectorToCragGQL,
    private apollo: Apollo,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<MoveSectorFormComponent>
  ) {}

  ngOnInit(): void {
    const subscription = this.cragsGQL
      .fetch({ country: this.data.countrySlug })
      .subscribe((result) => {
        this.crags = result.data.countryBySlug.crags as Crag[];
      });
    this.subscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  save(): void {
    this.saving = true;

    const value = this.form.value;

    const success = () => {
      this.apollo.client.resetStore().then(() => {
        this.dialogRef.close();
        this.router.navigate([
          `urejanje/uredi-plezalisce/${value.crag}/sektorji`,
        ]);
      });
    };
    const error = () => {
      this.snackBar.open('Pri premikanju je prišlo do napake', null, {
        panelClass: 'error',
        duration: 3000,
      });
    };

    this.moveSectorGQL
      .mutate({
        id: this.data.sector.id,
        cragId: value.crag,
      })
      .subscribe({
        next: success,
        error: error,
      });
  }
}
