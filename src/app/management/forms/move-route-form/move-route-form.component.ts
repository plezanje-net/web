import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Subscription, switchMap } from 'rxjs';
import {
  Crag,
  ManagementMoveRouteGetRouteGQL,
  ManagementMoveRouteToSectorGQL,
  Route,
  Sector,
} from 'src/generated/graphql';

export interface MoveRouteFormComponentData {
  route: Route;
  crag: Crag;
}

@Component({
  selector: 'app-move-route-form',
  templateUrl: './move-route-form.component.html',
  styleUrls: ['./move-route-form.component.scss'],
})
export class MoveRouteFormComponent implements OnInit, OnDestroy {
  form = new FormGroup({
    targetSector: new FormControl(null, Validators.required),
    targetRoute: new FormControl(null),
    primarySelection: new FormControl(null),
  });
  crag: Crag;
  saving = false;
  subscriptions: Subscription[] = [];
  targetSectors: Sector[];
  targetSector: Sector;

  sourceRoute: Route;
  targetRoute: Route;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: MoveRouteFormComponentData,
    private apollo: Apollo,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<MoveRouteFormComponent>,
    private managementMoveRouteGetRouteGQL: ManagementMoveRouteGetRouteGQL,
    private managementMoveRouteToSectorGQL: ManagementMoveRouteToSectorGQL
  ) {}

  ngOnInit(): void {
    this.crag = this.data.crag;
    this.targetSectors = this.data.crag.sectors.filter(
      ({ id }) => id != this.data.route.sector.id
    );

    const targetSectorSub =
      this.form.controls.targetSector.valueChanges.subscribe((sector) => {
        const sameNameRouteInTargetSector = sector.routes.find(
          (route: Route) => route.name === this.data.route.name
        );
        this.targetRoute = null;
        if (sameNameRouteInTargetSector) {
          this.form.controls.targetRoute.setValue(sameNameRouteInTargetSector);
        }
      });
    this.subscriptions.push(targetSectorSub);

    const sourceRouteSub = this.managementMoveRouteGetRouteGQL
      .fetch({
        id: this.data.route.id,
      })
      .subscribe(({ data }) => {
        this.sourceRoute = data.route as Route;
      });
    this.subscriptions.push(sourceRouteSub);

    const targetRouteSub = this.form.controls.targetRoute.valueChanges
      .pipe(
        switchMap((route) =>
          route != null
            ? this.managementMoveRouteGetRouteGQL.fetch({ id: route.id })
            : Promise.resolve(null)
        )
      )
      .subscribe((result) => {
        this.targetRoute = null;
        if (result != null) {
          this.targetRoute = result.data.route as Route;

          this.form.controls.primarySelection.setValue(
            this.targetRoute.created > this.sourceRoute.created
              ? 'source'
              : 'target'
          );
        }
      });
    this.subscriptions.push(targetRouteSub);
  }

  hasBaseDiff(route: Route): boolean {
    return !!route.difficultyVotes.find(({ isBase }) => isBase);
  }
  getBaseDiff(route: Route): number {
    return route.difficultyVotes.find(({ isBase }) => isBase)?.difficulty;
  }

  getNrNonBaseDiffVotes(route: Route): number {
    return route.difficultyVotes.filter(({ isBase }) => !isBase).length;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  save(): void {
    console.log(this.form.value);

    this.saving = true;

    const success = () => {
      this.apollo.client.resetStore().then(() => {
        this.dialogRef.close();
      });
    };
    const error = () => {
      this.snackBar.open('Pri premikanju je prišlo do napake', null, {
        panelClass: 'error',
        duration: 3000,
      });
    };

    this.managementMoveRouteToSectorGQL
      .mutate({
        input: {
          id: this.data.route.id,
          targetRouteId: this.form.value.targetRoute?.id,
          sectorId: this.form.controls.targetSector.value.id,
          primaryRoute: this.form.controls.primarySelection.value,
        },
      })
      .subscribe({
        next: success,
        error: error,
      });
  }
}
