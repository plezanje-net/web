import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Activity,
  ActivityEntryGQL,
  Crag,
  CreateActivityGQL,
  UpdateActivityGQL,
  IceFall,
  MyActivitiesGQL,
  Peak,
  Route,
  RoutesTouchesGQL,
  DryRunCreateActivityGQL,
  DryRunUpdateActivityGQL,
} from 'src/generated/graphql';
import dayjs from 'dayjs';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ActivityFormService } from './activity-form.service';
import { concatMap, EMPTY, map, of, switchMap } from 'rxjs';
import { Subscription } from 'rxjs';
import { ACTIVITY_TYPES } from 'src/app/common/activity.constants';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DryRunActivityDialogComponent } from './dry-run-activity-dialog/dry-run-activity-dialog.component';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.scss'],
})
export class ActivityFormComponent implements OnInit, OnDestroy {
  @Input() selectedRoutes: Route[];
  @Input() crag: Crag;
  @Input() peak: Peak;
  @Input() iceFall: IceFall;

  @Input() activity: Activity;

  // new - no activity yet, edit - edit activity fields but add no routes, add - add routes to existing activity
  @Input() formType: 'new' | 'edit' | 'add' = 'new';

  loading: boolean = false;
  loadingActivity: boolean = false;

  routes = new FormArray([]);

  typeOptions = ACTIVITY_TYPES.filter(
    (a) => a.value != 'peak' && a.value != 'iceFall'
  );

  activityForm = new FormGroup({
    type: new FormControl(null, Validators.required),
    name: new FormControl(''),
    cragId: new FormControl(null),
    peakId: new FormControl(null),
    iceFallId: new FormControl(null),
    duration: new FormControl(null),
    date: new FormControl(),
    partners: new FormControl(),
    notes: new FormControl(),
    routes: this.routes,
  });

  subscriptions: Subscription[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private createActivityGQL: CreateActivityGQL,
    private updateActivityGQL: UpdateActivityGQL,
    private dryRunCreateActivityGQL: DryRunCreateActivityGQL,
    private dryRunUpdateActivityGQL: DryRunUpdateActivityGQL,
    private router: Router,
    public location: Location,
    private localStorageService: LocalStorageService,
    private activityFormService: ActivityFormService,
    private myActivitiesGQL: MyActivitiesGQL,
    private activityEntryGQL: ActivityEntryGQL,
    private routesTouchesGQL: RoutesTouchesGQL
  ) {}

  ngOnInit(): void {
    if (this.formType == 'edit' && this.crag != null) {
      this.activityForm.controls.date.disable();
    }

    if (this.activity) {
      this.activityForm.patchValue({
        date: this.activity.date,
        notes: this.activity.notes,
        partners: this.activity.partners,
        duration: this.activity.duration,
        name: this.activity.name,
        type: this.activity.type,
      });
    }

    if (this.selectedRoutes != null) {
      this.selectedRoutes.forEach((route) => {
        this.addRoute(route);
      });
    }

    this.activityForm.controls.date.valueChanges
      .pipe(
        switchMap((date) => {
          // Disable all ascentType inputs, until we get users route touches before the newly selected date
          this.routes.controls.forEach((routeFormGroup) =>
            routeFormGroup.get('ascentType').disable({ emitEvent: false })
          );

          this.patchRouteDates(date); // TODO: do we need to do this? logging routes with different dates is not possible anymore, so we can have only one date now!

          const routeIds = new Set(
            this.routes.controls.map(
              (routeFormGroup) => routeFormGroup.get('routeId').value
            )
          );
          return this.routesTouchesGQL.fetch({
            input: {
              routeIds: [...routeIds],
              before: date,
            },
          });
        })
      )
      .subscribe((result) => {
        const { ticked, tried, trTicked } = result.data.routesTouches;
        const tickedRoutes = new Set(ticked.map((ar) => ar.routeId));
        const triedRoutes = new Set(tried.map((ar) => ar.routeId));
        const trTickedRoutes = new Set(trTicked.map((ar) => ar.routeId));

        this.routes.controls.forEach((route) => {
          const routeId = route.get('routeId').value;

          const routeTicked = tickedRoutes.has(routeId);
          route.get('ticked').setValue(routeTicked);

          const routeTried = triedRoutes.has(routeId);
          route.get('tried').setValue(routeTried);

          const routeTrTicked = trTickedRoutes.has(routeId);
          route.get('trTicked').setValue(routeTrTicked);

          // If not already set, set default value for ascentType based on user's log history (might get changed rihgt away with revalidateAT, but it's a good first guess anyway)
          if (!route.get('ascentType').value) {
            route.patchValue(
              {
                ascentType: routeTicked ? 'repeat' : 'redpoint',
              },
              { emitEvent: false }
            );
          }
        });

        this.activityFormService.revalidateAscentTypes();
        this.activityFormService.conditionallyDisableVotedDifficultyInputs();
        this.activityFormService.conditionallyDisableVotedStarRatingInputs();

        // Now that user's ascent history has been fetched and ascentTypes revalidated, we can reenable ascentType controls
        this.routes.controls.forEach((routeFormGroup) => {
          routeFormGroup.get('ascentType').enable();
          // routeFormGroup.get('ascentType').enable({ emitEvent: false }); // TODO: this would be the better way, but seems that material needs event emitted in order to update the display of the field (does work if no material)
        });
      });

    if (this.crag != null && this.formType != 'edit') {
      this.watchForOverlappingActivity();
    }

    if (this.activity == null) {
      this.activityForm.patchValue({
        date: dayjs().format('YYYY-MM-DD'),
        type: this.getInitialType(),
      });
    }

    if (this.crag != null) {
      this.activityForm.patchValue({
        name: this.crag.name,
        cragId: this.crag.id,
      });
    }

    if (this.formType != 'new' || this.crag) {
      this.activityForm.controls.type.disable();
    }

    this.activityFormService.initialize(this.routes);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  getInitialType() {
    if (this.crag != null) return 'crag';
    if (this.peak != null) return 'peak';
    if (this.iceFall != null) return 'iceFall';
    return null;
  }

  watchForOverlappingActivity() {
    this.activityForm.controls.date.valueChanges
      .pipe(
        switchMap((date) => {
          this.loadingActivity = true;
          return this.myActivitiesGQL.fetch({
            input: {
              dateFrom: dayjs(date).format('YYYY-MM-DD'),
              dateTo: dayjs(date).format('YYYY-MM-DD'),
              cragId: this.crag.id,
            },
          });
        }),
        map((response) => response.data.myActivities.items[0] ?? null),
        switchMap((activity) =>
          activity != null
            ? this.activityEntryGQL.fetch({ id: activity.id })
            : of(null)
        ),
        map((response) => (response ? response.data.activity : null))
      )
      .subscribe((activity) => {
        this.loadingActivity = false;

        if (activity == null && this.activity != null) {
          this.activityForm.patchValue({
            notes: null,
            partners: null,
          });
        }
        if (activity == null) {
          this.activity = null;
          this.formType = 'new';
          return;
        }

        this.activity = <Activity>activity;
        this.activityForm.patchValue({
          notes: activity.notes,
          partners: activity.partners,
        });

        this.formType = this.routes.length == 0 ? 'edit' : 'add';
      });
  }

  patchRouteDates(value: dayjs.Dayjs): void {
    this.routes.controls.forEach((control) =>
      control.patchValue({ date: value })
    );
  }

  addRoute(route: any): void {
    this.routes.push(
      new FormGroup({
        routeId: new FormControl(route.id),
        name: new FormControl(route.name),
        slug: new FormControl(route.slug),
        difficulty: new FormControl(route.difficulty),
        defaultGradingSystemId: new FormControl(route.defaultGradingSystem.id),
        isProject: new FormControl(route.isProject),
        ascentType: new FormControl({ value: null, disabled: true }, [
          Validators.required,
        ]),
        date: new FormControl(),
        partner: new FormControl(),
        publish: new FormControl('public'),
        notes: new FormControl(),
        votedStarRating: new FormControl(),
        votedDifficulty: new FormControl(),
        ticked: new FormControl(route.ticked),
        tried: new FormControl(route.tried),
        trTicked: new FormControl(route.trTicked),
        type: new FormControl(route.routeType.id),
      })
    );
  }

  save(): void {
    const data = this.activityForm.getRawValue();

    this.activityForm.disable({ emitEvent: false });

    const routes = this.routes.value.map((route: any, i: number) => {
      return {
        date: dayjs(data.date).format('YYYY-MM-DD'), // TODO enforce this on backend
        partner: route.partner || data.partners,
        notes: route.notes,
        routeId: route.routeId,
        ascentType: route.ascentType,
        votedStarRating: route.votedStarRating,
        publish: route.publish,
        votedDifficulty: route.votedDifficulty,
        position: i, // position of the route within the same activity of ones log
      };
    });

    const activityInput = {
      date: dayjs(data.date).format('YYYY-MM-DD'), // TODO backend make sure that this did not change in case it has logged routes
      duration: data.duration,
      name: data.name,
      notes: data.notes,
      partners: data.partners,
    };

    // We have 3 possible cases here:
    // 1: edit  -> we are updating the activity data only (no routes changes) -> no dry run is needed
    // 2: add   -> we are adding routes to existing activity -> do dry run
    // 3: new   -> we are creating a new activity -> do dry run

    // Before actually saving (mutating) the log, do a dry run and get back the ascent type changes that the log might trigger
    // If any, show them to the user, and only after another confirmation, do the actual mutation
    switch (this.formType) {
      case 'edit':
        const editActivityInput = {
          ...activityInput,
          id: this.activity.id,
        };

        this.updateActivityGQL
          .mutate({ input: editActivityInput, routes: [] })
          .subscribe(this.getActivityMutationObserver());
        break;

      case 'add':
        const addToActivityInput = {
          ...activityInput,
          id: this.activity.id,
        };

        this.dryRunUpdateActivityGQL
          .fetch({ input: addToActivityInput, routes })
          .pipe(
            concatMap((result) => {
              if (result.data.dryRunUpdateActivity.length) {
                // If we got back some data, there will be changes in 'future' logs, so user needs to preview and confirm them
                const dryRunSideEffects = result.data.dryRunUpdateActivity;
                return this.dialog
                  .open(DryRunActivityDialogComponent, {
                    data: { dryRunSideEffects },
                  })
                  .afterClosed();
              } else {
                return of(true); // If no data from dryRun, theb emit true and complete as if the dialog was opened and confirmed
              }
            }),
            concatMap((confirmed) => {
              if (confirmed) {
                // User confirmed autocorrect changes, so do the actual mutation now
                this.loading = true;
                return this.updateActivityGQL.mutate({
                  input: addToActivityInput,
                  routes,
                });
              } else {
                // User declined. Nothing to do. Make form active again and complete.
                this.activityForm.enable({ emitEvent: false });
                this.loading = false;
                return EMPTY; // just completes
              }
            })
          )
          .subscribe(this.getActivityMutationObserver());
        break;

      case 'new':
        const createActivityInput = {
          ...activityInput,
          type: data.type,
          cragId: data.cragId,
          peakId: data.peakId,
          iceFallId: data.iceFallId,
        };

        this.dryRunCreateActivityGQL
          .fetch({ input: createActivityInput, routes })
          .pipe(
            concatMap((result) => {
              if (result.data.dryRunCreateActivity.length) {
                // If we got back some data, there will be changes in 'future' logs, so user needs to preview and confirm them
                const dryRunSideEffects = result.data.dryRunCreateActivity;
                return this.dialog
                  .open(DryRunActivityDialogComponent, {
                    data: { dryRunSideEffects },
                  })
                  .afterClosed();
              } else {
                return of(true); // If no data from dryRun, theb emit true and complete as if the dialog was opened and confirmed
              }
            }),
            concatMap((confirmed) => {
              if (confirmed) {
                // User confirmed autocorrect changes, so do the actual mutation now
                this.loading = true;
                return this.createActivityGQL.mutate({
                  input: createActivityInput,
                  routes,
                });
              } else {
                // User declined. Nothing to do. Make form active again and complete.
                this.activityForm.enable({ emitEvent: false });
                this.loading = false;
                return EMPTY; // just completes
              }
            })
          )
          .subscribe(this.getActivityMutationObserver());
    }
  }

  private getActivityMutationObserver() {
    return {
      next: () => {
        if (this.crag) {
          this.localStorageService.removeItem('activity-selection');

          if (this.formType == 'new') {
            this.successCragWithRoutes();
            return;
          }
        }
        this.snackBar.open(
          this.formType == 'edit'
            ? 'Vnos v plezalnem dnevniku je bil posodobljen'
            : 'Vnos je bil shranjen v plezalni dnevnik',
          null,
          {
            duration: 3000,
          }
        );
        this.router.navigate(['/plezalni-dnevnik']);
      },
      error: () => {
        this.loading = false;
        this.activityForm.enable();
        this.snackBar.open('Vnosa ni bilo mogoče shraniti', null, {
          panelClass: 'error',
          duration: 3000,
        });
      },
    };
  }

  successCragWithRoutes() {
    this.localStorageService.removeItem('activity-selection');
    this.snackBar
      .open('Vnos je bil shranjen v plezalni dnevnik', 'Odpri dnevnik', {
        duration: 3000,
      })
      .onAction()
      .subscribe(() => {
        if (this.crag) {
          this.router.navigate(['/plezalni-dnevnik']);
        }
      });

    // based on crag type navigate back to either peaks(alpinism) or sport climbing section
    if (this.crag.type === 'alpine') {
      this.router.navigate(['/alpinizem', 'stena', this.crag.slug]);
    } else {
      this.router.navigate(['/plezalisce/', this.crag.slug]);
    }
  }
}
