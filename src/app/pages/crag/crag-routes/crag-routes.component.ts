import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { SnackBarButtonsComponent } from 'src/app/common/snack-bar-buttons/snack-bar-buttons.component';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import moment from 'moment';
import ActivitySelection from 'src/app/types/activity-selection.interface';
import { ActivityFormComponent } from 'src/app/forms/activity-form/activity-form.component';
import { Crag, MyCragSummaryGQL, Route, RouteGradesGQL, RouteGradesQuery } from 'src/generated/graphql';

@Component({
  selector: 'app-crag-routes',
  templateUrl: './crag-routes.component.html',
  styleUrls: ['./crag-routes.component.scss'],
})
export class CragRoutesComponent implements OnInit {
  @Input() crag: Crag;

  selectedRoutes: Route[] = [];
  selectedRoutesIds: string[] = [];
  ascents: any = {};
  routeGradesLoading: boolean;
  routeGrades: Record<string, string | any>[];
  activeGradesPopupId: string | null = null;

  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router,
    private myCragSummaryGQL: MyCragSummaryGQL,
    private localStorageService: LocalStorageService,
    private routeGradesGQL: RouteGradesGQL,
  ) {}

  ngOnInit(): void {
    // Used for activity development, remove after
    // const n = 3;
    // for (let i = 0; i < n; i++) {
    //   this.selectedRoutes.push(this.crag.sectors[0].routes[i])
    // }
    // this.addActivity();

    if (this.authService.currentUser) {
      this.loadActivity();
    }

    const activitySelection: ActivitySelection = this.localStorageService.getItem('activity-selection');
    if (activitySelection && activitySelection.routes.length && activitySelection.crag.id === this.crag.id) {
      this.selectedRoutes = activitySelection.routes;
      this.selectedRoutesIds = this.selectedRoutes.map((route) => route.id);
      this.openSnackBar();
    }
  }

  changeSelection(route: Route): void {
    const i = this.selectedRoutes.indexOf(route);
    if (i > -1) {
      this.selectedRoutes.splice(i, 1);
    } else {
      this.selectedRoutes.push(route);
    }

    if (this.selectedRoutes.length > 0) {
      this.openSnackBar();

      this.selectedRoutesIds = this.selectedRoutes.map((selectedRoute) => selectedRoute.id);
      this.localStorageService.setItem(
        'activity-selection',
        {
          crag: this.crag,
          routes: this.selectedRoutes,
        },
        moment(new Date()).add(1, 'day').toISOString()
      );
    } else {
      this.snackBar.dismiss();
      this.localStorageService.removeItem('activity-selection');
    }
  }

  openSnackBar(): void {
    this.snackBar
      .openFromComponent(SnackBarButtonsComponent, {
        horizontalPosition: 'end',
        data: {
          buttons: [
            {
              label: `Shrani v plezalni dnevnik (${this.selectedRoutes.length})`,
            },
          ],
        },
      })
      .onAction()
      .subscribe(() => {
        this.addActivity();
      });
  }

  addActivity(): void {
    this.authService.guardedAction({}).then(() => {
      this.router.navigate(['/plezalni-dnevnik/vpis']);
    });
  }

  loadActivity(): void {
    this.myCragSummaryGQL
      .watch({ input: { cragId: this.crag.id } })
      .valueChanges.subscribe((result) => {
        result.data.myCragSummary.forEach((ascent) => {
          this.ascents[ascent.route.id] = ascent.ascentType;
        });
      });
  }

  displayRouteGrades(route: Route): void {
    this.activeGradesPopupId = route.id;
    this.routeGradesLoading = true;

    this.routeGradesGQL
      .watch({ routeId: route.id })
      .valueChanges
      .subscribe((result) => {
        this.routeGradesLoading = false;

        if (!result.errors) {
          this.routeGradesQuerySuccess(result.data);
        } else {
          this.routeGradesQueryError();
        }
      });
  }

  hideRouteGrades(route: Route): void {
    this.activeGradesPopupId = null;
  }

  routeGradesQuerySuccess(queryData: RouteGradesQuery): void {
    this.routeGrades = queryData.route.grades.slice().sort((a, b) => a.grade - b.grade);

    // https://www.plezanje.net/climbing/help/IzracunOcen.pdf
    if (this.routeGrades.length === 2) {
      // TODO: ignore the grade that isn't the base grade
    } else if (this.routeGrades.length > 2) {
      // 20% of min and 20% of max grades (rounded to the whole number) get excluded from the calculation of grade average
      const roundedFifth = Math.round(this.routeGrades.length * 0.2);

      this.routeGrades = this.routeGrades.map((routeGrade, i) => {
          return {
          ...routeGrade,
          includedInCalculation: i >= roundedFifth && i < this.routeGrades.length - roundedFifth,
        };
      });
    }
  }

  routeGradesQueryError(): void {
    console.error('TODO');
  }
}
