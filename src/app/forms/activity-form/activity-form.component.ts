import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  Crag,
  CreateActivityGQL,
  Route,
  namedOperations,
} from 'src/generated/graphql';

import moment from 'moment';
import { Router } from '@angular/router';
import { gradeNameToNumberMap } from 'src/app/common/grade-names.constants';

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

  @Input() crag;
  @Input() selectedRoutes;

  constructor(
    private snackBar: MatSnackBar,
    private createActivityGQL: CreateActivityGQL,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.selectedRoutes.forEach((route) => this.addRoute(route));

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
        date: new FormControl(),
        partner: new FormControl(),
        publish: new FormControl('private'),
        notes: new FormControl(),
        stars: new FormControl(),
        gradeSuggestion: new FormControl(),
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

  add(): boolean {
    this.addRoute({});
    return false;
  }

  save(): void {
    let data = this.activityForm.value;

    this.loading = true;
    this.activityForm.disable();

    const activity = {
      date: moment(data.date).format('YYYY-MM-DD'),
      name: this.crag.name,
      type: 'crag', // TODO: resolve from parameters
      notes: data.notes,
      partners: data.partners,
      cragId: this.crag.id,
    };

    const routes = this.routes.value.map((route: any, i: number) => {
      return {
        date: route.date || activity.date,
        partner: route.partner || activity.partners,
        ascentType: route.ascentType,
        notes: route.notes,
        position: i,
        publish: route.publish,
        routeId: route.routeId,
        name: route.name,
        difficulty: route.difficulty,
        grade: gradeNameToNumberMap[route.gradeSuggestion],
        stars: route.stars,
      };
    });

    this.createActivityGQL
      .mutate(
        { input: activity, routes },
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
          this.router.navigate(['/plezalni-dnevnik']);
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
