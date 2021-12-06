import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { SnackBarButtonsComponent } from 'src/app/shared/snack-bar-buttons/snack-bar-buttons.component';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import moment from 'moment';
import ActivitySelection from 'src/app/types/activity-selection.interface';
import {
  Crag,
  MyCragSummaryGQL,
  Route,
  RouteGradesGQL,
  RouteGradesQuery,
  RouteCommentsGQL,
  RouteCommentsQuery,
} from 'src/generated/graphql';

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
  activeCommentsPopupId: string | null = null;
  routeCommentsLoading: boolean;
  routeComments: Record<string, string | any>[];
  activePitchesPopupId: string | null = null;

  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router,
    private myCragSummaryGQL: MyCragSummaryGQL,
    private localStorageService: LocalStorageService,
    private routeGradesGQL: RouteGradesGQL,
    private routeCommentsGQL: RouteCommentsGQL
  ) {}

  ngOnInit(): void {
    if (this.authService.currentUser) {
      this.loadActivity();
    }

    const activitySelection: ActivitySelection =
      this.localStorageService.getItem('activity-selection');
    if (
      activitySelection &&
      activitySelection.routes.length &&
      activitySelection.crag.id === this.crag.id
    ) {
      this.selectedRoutes = activitySelection.routes;
      this.selectedRoutesIds = this.selectedRoutes.map((route) => route.id);
      this.openSnackBar();
    }
  }

  changeSelection(route: Route): void {
    const i = this.selectedRoutes.findIndex((r) => r.id === route.id);
    if (i > -1) {
      this.selectedRoutes.splice(i, 1);
    } else {
      this.selectedRoutes.push(route);
    }

    if (this.selectedRoutes.length > 0) {
      this.openSnackBar();

      this.selectedRoutesIds = this.selectedRoutes.map(
        (selectedRoute) => selectedRoute.id
      );
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
    this.authService.guardedAction({}).then((success) => {
      if (success) {
        this.router.navigate(['/plezalni-dnevnik/vpis']);
      } else {
        this.openSnackBar();
      }
    });
  }

  loadActivity(): void {
    this.myCragSummaryGQL
      .watch({ input: { cragId: this.crag.id } })
      .valueChanges.subscribe((result) => {
        result.data?.myCragSummary.forEach((ascent) => {
          this.ascents[ascent.route.id] = ascent.ascentType;
        });
      });
  }

  displayRouteGrades(route: Route): void {
    this.activeGradesPopupId = route.id;
    this.activeCommentsPopupId = null;
    this.activePitchesPopupId = null;
    this.routeGradesLoading = true;

    this.routeGradesGQL
      .watch({ routeId: route.id })
      .valueChanges.subscribe((result) => {
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
    this.routeGrades = queryData.route.grades;
  }

  routeGradesQueryError(): void {
    console.error('TODO');
  }

  displayRouteComments(route: Route): void {
    this.activeCommentsPopupId = route.id;
    this.activeGradesPopupId = null;
    this.activePitchesPopupId = null;
    this.routeCommentsLoading = true;

    this.routeCommentsGQL
      .watch({ routeId: route.id })
      .valueChanges.subscribe((result) => {
        this.routeCommentsLoading = false;

        if (!result.errors) {
          this.routeCommentsQuerySuccess(result.data);
        } else {
          this.routeCommentsQueryError();
        }
      });
  }

  hideRouteComments(route: Route): void {
    this.activeCommentsPopupId = null;
  }

  displayRoutePitches(route: Route): void {
    this.activePitchesPopupId = route.id;
    this.activeCommentsPopupId = null;
    this.activeGradesPopupId = null;
  }

  hideRoutePitches(route: Route): void {
    this.activePitchesPopupId = null;
  }

  routeCommentsQuerySuccess(queryData: RouteCommentsQuery): void {
    this.routeComments = queryData.route.comments;
    // TODO filter out conditions and warnings? ask in slack
  }

  routeCommentsQueryError(): void {
    console.error('TODO');
  }
}
