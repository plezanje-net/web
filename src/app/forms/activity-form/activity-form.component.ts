import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  Crag,
  CreateActivityGQL,
  Route,
  namedOperations,
} from 'src/generated/graphql';

import moment from 'moment';

export interface DialogData {
  crag: Crag;
  routes: Route[];
}

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.scss'],
})
export class ActivityFormComponent implements OnInit {
  loading: boolean = false;

  routes = new FormArray([]);

  activityForm = new FormGroup({
    date: new FormControl(moment()),
    partners: new FormControl(),
    notes: new FormControl(),
    onlyRoutes: new FormControl(false),
    routes: this.routes,
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<ActivityFormComponent>,
    private snackBar: MatSnackBar,
    private createActivityGQL: CreateActivityGQL
  ) {}

  ngOnInit(): void {
    this.data.routes.forEach((route) => this.addRoute(route));

    this.activityForm.controls.date.valueChanges.subscribe((value) => {
      this.patchRouteDates(value);
    });

    this.activityForm.controls.onlyRoutes.valueChanges.subscribe((value) => {
      if (!value) {
        this.patchRouteDates(this.activityForm.value.date);
      }
    });

    this.activityForm.patchValue({ date: moment() });
  }

  patchRouteDates(value: moment.Moment) {
    this.routes.controls.forEach((control) =>
      control.patchValue({ date: value })
    );
  }

  addRoute(route: any) {
    this.routes.push(
      new FormGroup({
        routeId: new FormControl(route.id),
        name: new FormControl(route.name),
        grade: new FormControl(route.grade),
        difficulty: new FormControl(route.difficulty),
        ascentType: new FormControl('redpoint'),
        topRope: new FormControl(false),
        date: new FormControl(),
        partner: new FormControl(),
        publish: new FormControl('private'),
        notes: new FormControl(),
      })
    );
  }

  moveRoute(routeIndex: number, direction: number) {
    if (direction == 0) {
      this.routes.controls.splice(routeIndex, 1);
      return;
    }

    if (direction == 2) {
      this.routes.controls.splice(
        routeIndex,
        0,
        this.routes.controls[routeIndex]
      );
      return;
    }

    const temp = this.routes.controls[routeIndex + direction];

    this.routes.controls[routeIndex + direction] =
      this.routes.controls[routeIndex];
    this.routes.controls[routeIndex] = temp;
  }

  add() {
    this.addRoute({});
    return false;
  }

  save() {
    let data = this.activityForm.value;

    console.log(data);

    this.loading = true;
    this.activityForm.disable();

    const activity = {
      date: moment(data.date).format('YYYY-MM-DD'),
      name: this.data.crag.name,
      type: 'crag', // TODO: resolve from parameters
      notes: data.notes,
      partners: data.partners,
      cragId: this.data.crag.id,
    };

    const routes = this.routes.value.map((route: any, i: number) => {
      return {
        date: route.date || activity.date,
        partner: route.partner || activity.partners,
        ascentType: (route.topRope ? 't_' : '') + route.ascentType,
        notes: route.notes,
        position: i,
        publish: route.publish,
        routeId: route.routeId,
        name: route.name,
        grade: route.grade,
        difficulty: route.difficulty,
      };
    });

    this.createActivityGQL
      .mutate(
        { input: activity, routes: routes },
        {
          refetchQueries: [
            namedOperations.Query.MyActivities,
            namedOperations.Query.MyActivityRoutes,
          ],
        }
      )
      .subscribe(
        () => {
          this.snackBar.open('Vnos je bil shranjen v plezalni dnevnik', null, {
            duration: 3000,
          });
          this.dialogRef.close();
        },
        (error) => {
          this.loading = false;
          this.activityForm.enable();
          this.snackBar.open(
            'Vnosa ni bilo mogoče shraniti v plezalni dnevnik',
            null,
            { panelClass: 'error', duration: 3000 }
          );
        }
      );
  }
}
