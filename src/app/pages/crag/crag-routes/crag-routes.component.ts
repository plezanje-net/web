import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
  loading = false;
  expandedRowId: string;
  previousExpandedRowId: string;
  expandedRowHeight: number;

  section: string;

  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router,
    private myCragSummaryGQL: MyCragSummaryGQL,
    private localStorageService: LocalStorageService,
    private changeDetection: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.section = this.router.url.includes('/alpinizem/stena')
      ? 'alpinism'
      : 'sport';

    this.authService.currentUser.subscribe((user) =>
      this.loadActivity(user != null)
    );

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

      this.selectedRoutesIds = this.selectedRoutes.map(
        (selectedRoute) => selectedRoute.id
      );

      // Append users previous activity (summary) to the routes that are being logged
      const selectedRoutesWTouch = this.selectedRoutes.map((route) => ({
        ...route,
        tried: !!this.ascents[route.id],
        ticked: ASCENT_TYPES.some(
          (ascentType) =>
            this.ascents[route.id] == ascentType.value && ascentType.tick
        ),
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
      .subscribe(() => this.addActivity());
  }

  addRoutesToLocalStorage(routes: Route[]) {
    this.localStorageService.setItem(
      'activity-selection',
      {
        crag: this.crag,
        routes: routes,
      },
      moment(new Date()).add(1, 'day').toISOString()
    );
  }

  addActivity(): void {
    this.authService
      .guardedAction({
        message: 'Za uporabo plezalnega dnevnika se moraš prijaviti.',
      })
      .then((success) => {
        if (success) {
          // Append users previous activity (summary) to the routes that are being logged
          const selectedRoutesWTouch = this.selectedRoutes.map((route) => ({
            ...route,
            tried: !!this.ascents[route.id],
            ticked: ASCENT_TYPES.some(
              (ascentType) =>
                this.ascents[route.id] == ascentType.value && ascentType.tick
            ),
          }));

          this.addRoutesToLocalStorage(selectedRoutesWTouch);

          this.router.navigate([
            '/plezalni-dnevnik/vpis',
            { crag: this.crag.id },
          ]);
        } else {
          this.openSnackBar();
        }
      });
  }

  loadActivity(authenticated: boolean): void {
    if (!authenticated) {
      this.ascents = [];
      return;
    }

    this.myCragSummaryGQL
      .watch({ input: { cragId: this.crag.id } })
      .valueChanges.subscribe((result) => {
        this.loading = false;
        result.data?.myCragSummary.forEach((ascent) => {
          this.ascents[ascent.route.id] = ascent.ascentType;
        });
      });
  }

  expandRow(routeId: string): void {
    if (this.expandedRowId === routeId) {
      this.previousExpandedRowId = this.expandedRowId;
      this.expandedRowId = null;
    } else {
      this.previousExpandedRowId = this.expandedRowId;
      this.expandedRowId = routeId;
    }

    setTimeout(() => {
      /**
       * After the animation is finished, the previous row ID should be nulled.
       * This ensures that, if the user will click on the same (previous) row again, it will be rendered again and not just reused.
       * This should set the height for the animation properly.
       */
      this.previousExpandedRowId = null;
    }, 300);
  }

  onPreviewHeightEvent(height: number): void {
    if (height !== 0) {
      height += 20; // for the 20px padding above the content
    }

    this.expandedRowHeight = height;
    this.changeDetection.detectChanges();
  }
}
