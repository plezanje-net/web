import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import moment from 'moment';

export interface DialogData {
  crag: any,
  routes: any[],
}

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.scss']
})
export class ActivityFormComponent implements OnInit {

  loading: boolean = false;

  routes = new FormArray([])

  activityForm = new FormGroup({
    date: new FormControl(moment()),
    partners: new FormControl,
    notes: new FormControl,
    onlyRoutes: new FormControl(false),
    routes: this.routes
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<ActivityFormComponent>,
    private snackBar: MatSnackBar
  ) { }

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
    this.routes.controls.forEach((control) => control.patchValue({ date: value }))
  }

  addRoute(route: any) {
    this.routes.push(new FormGroup({
      routeId: new FormControl(route.id),
      name: new FormControl(route.name),
      grade: new FormControl(route.grade),
      difficulty: new FormControl(route.difficulty),
      ascentType: new FormControl("redpoint"),
      topRope: new FormControl(false),
      date: new FormControl,
      partner: new FormControl,
      publish: new FormControl("private"),
      notes: new FormControl
    }))
  }

  moveRoute(routeIndex: number, direction: number) {
    if (direction == 0) {
      this.routes.controls.splice(routeIndex, 1);
      return;
    }

    const temp = this.routes.controls[routeIndex + direction];

    this.routes.controls[routeIndex + direction] = this.routes.controls[routeIndex];
    this.routes.controls[routeIndex] = temp;
  }

  add() {
    this.addRoute({});
    return false;
  }

  save() {

    let value = this.activityForm.value;

    this.loading = true;
    this.activityForm.disable();

    setTimeout(() => {
      this.snackBar.open("Vnos je bil shranjen v plezalni dnevnik (not really)", null, { duration: 3000 });
      this.dialogRef.close();
    }, 3000);
  }

}
