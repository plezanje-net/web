import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { SnackBarButtonsComponent } from 'src/app/shared/snack-bar-buttons/snack-bar-buttons.component';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import moment from 'moment';
import ActivitySelection from 'src/app/types/activity-selection.interface';
import { Crag, MyCragSummaryGQL, Route } from 'src/generated/graphql';
import { ASCENT_TYPES } from 'src/app/common/activity.constants';
import { IDistribution } from 'src/app/common/distribution-chart/distribution-chart.component';

@Component({
  selector: 'app-crag-routes',
  templateUrl: './crag-routes.component.html',
  styleUrls: ['./crag-routes.component.scss'],
})
export class CragRoutesComponent implements OnInit, OnDestroy {
  @Input() crag: Crag;

  selectedRoutes: Route[] = [];
  selectedRoutesIds: string[] = [];
  ascents: any = {};
  difficultyVotesLoading: boolean;
  difficultyVotes: Record<string, string | any>[];
  activeDifficultyVotesPopupId: string | null = null;
  activeCommentsPopupId: string | null = null;
  activePitchesPopupId: string | null = null;
  loading = false;
  expandedRowId: string;
  previousExpandedRowId: string;
  gradeDistribution: IDistribution[];
  expandedRowHeight: number;

  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router,
    private myCragSummaryGQL: MyCragSummaryGQL,
    private localStorageService: LocalStorageService,
    private changeDetection: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.authService.currentUser) {
      this.loading = true; // needed because we cannot pass ascents to activity log (through local storage) until this loads
      this.loadActivity();
    }

    const activitySelection: ActivitySelection = this.localStorageService.getItem('activity-selection');
    if (activitySelection && activitySelection.routes.length && activitySelection.crag.id === this.crag.id) {
      this.selectedRoutes = activitySelection.routes;
      this.selectedRoutesIds = this.selectedRoutes.map((route) => route.id);
      this.openSnackBar();
    }
  }

  ngOnDestroy(): void {
    this.snackBar.dismiss();
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

      this.selectedRoutesIds = this.selectedRoutes.map((selectedRoute) => selectedRoute.id);

      // Append users previous activity (summary) to the routes that are being logged
      const selectedRoutesWTouch = this.selectedRoutes.map((route) => ({
        ...route,
        tried: !!this.ascents[route.id],
        ticked: ASCENT_TYPES.some((ascentType) => this.ascents[route.id] == ascentType.value && ascentType.tick),
      }));

      this.localStorageService.setItem(
        'activity-selection',
        {
          crag: this.crag,
          routes: selectedRoutesWTouch,
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
    this.myCragSummaryGQL.watch({ input: { cragId: this.crag.id } }).valueChanges.subscribe((result) => {
      this.loading = false;
      result.data?.myCragSummary.forEach((ascent) => {
        this.ascents[ascent.route.id] = ascent.ascentType;
      });
    });
  }
  displayRoutePitches(route: Route): void {
    this.activePitchesPopupId = route.id;
  }

  hideRoutePitches(route: Route): void {
    this.activePitchesPopupId = null;
  }

  expandRow(routeId: string): void {
    if (this.expandedRowId === routeId) {
      this.expandedRowId = null;
      this.previousExpandedRowId = this.expandedRowId;
    } else {
      // TODO move saved comments and votes to previous comments and votes
      this.previousExpandedRowId = this.expandedRowId;
      this.expandedRowId = routeId;
    }
  }

  onPreviewHeightEvent(height: number): void {
    height += 40; // for the 20px padding above and below the content
    this.expandedRowHeight = height;
    this.changeDetection.detectChanges();
  }
}
