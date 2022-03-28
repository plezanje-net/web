import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import {
  concatMap,
  filter,
  Subject,
  Subscription,
  switchMap,
  take,
} from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ACTIVITY_TYPES } from 'src/app/common/activity.constants';
import { FilteredTable } from 'src/app/common/filtered-table';
import { LayoutService } from 'src/app/services/layout.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { DataError } from 'src/app/types/data-error';
import { GenderizeVerbPipe } from 'src/app/shared/pipes/genderize-verb.pipe';
import {
  Activity,
  ActivityFiltersCragGQL,
  ActivityFiltersCragQuery,
  DeleteActivityGQL,
  FindActivitiesInput,
  MyActivitiesGQL,
  MyActivitiesQuery,
  namedOperations,
} from 'src/generated/graphql';

export interface RowAction {
  item: Activity;
  action: string;
}

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss'],
})
export class ActivityLogComponent implements OnInit, OnDestroy {
  error: DataError = null;

  activities: MyActivitiesQuery['myActivities']['items'];
  pagination: MyActivitiesQuery['myActivities']['meta'];

  loading = false;

  filters = new FormGroup({
    dateFrom: new FormControl(),
    dateTo: new FormControl(),
    type: new FormControl(),
    cragId: new FormControl(),
  });

  forCrag: ActivityFiltersCragQuery['crag'];

  filteredTable = new FilteredTable(
    [
      { name: 'date', label: 'Datum', sortable: true, defaultSort: 'DESC' },
      { name: 'crag', label: 'Aktivnost' },
      { name: 'route', label: 'Lokacija' },
      { name: 'nrRoutes', label: '' },
    ],
    [
      { name: 'dateFrom', type: 'date' },
      { name: 'dateTo', type: 'date' },
      { name: 'type', type: 'multiselect' },
      { name: 'cragId', type: 'relation' },
    ]
  );

  rowAction$ = new Subject<RowAction>();

  activityTypes = ACTIVITY_TYPES;

  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private myActivitiesGQL: MyActivitiesGQL,
    private activityFiltersCragGQL: ActivityFiltersCragGQL,
    private deleteActivityGQL: DeleteActivityGQL,
    private genderizeVerbPipe: GenderizeVerbPipe
  ) {}

  ngOnInit(): void {
    this.layoutService.$breadcrumbs.next([
      {
        name: 'Plezalni dnevnik',
      },
    ]);

    const ft = this.filteredTable;

    const navSub = ft.navigate$.subscribe((params) =>
      this.router.navigate(['/plezalni-dnevnik', params])
    );
    this.subscriptions.push(navSub);

    const routeParamsSub = this.activatedRoute.params.subscribe((params) => {
      ft.setRouteParams(params);

      this.filters.patchValue(ft.filterParams);

      this.applyRelationFilterDisplayValues();

      this.loading = true;

      const queryParams: FindActivitiesInput = ft.queryParams;

      this.myActivitiesGQL
        .watch({ input: queryParams })
        .valueChanges.subscribe((result) => {
          this.loading = false;
          ft.navigating = false;

          if (result.errors != null) {
            this.queryError();
          } else {
            this.querySuccess(result.data.myActivities);
          }
        });
    });
    this.subscriptions.push(routeParamsSub);

    const filtersSub = this.filters.valueChanges.subscribe((values) => {
      if (ft.navigating) {
        ft.navigating = false;
      } else {
        ft.setFilterParams(values);
      }
    });
    this.subscriptions.push(filtersSub);

    const actionsSub = this.rowAction$.subscribe((action) => {
      switch (action.action) {
        case 'filterByCrag':
          this.forCrag = action.item.crag;
          this.filters.patchValue({
            cragId: action.item.crag.id,
          });
          break;
        case 'delete':
          this.deleteActivity(action.item);
          break;
      }
    });
    this.subscriptions.push(actionsSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  applyRelationFilterDisplayValues() {
    if (this.filters.value.cragId != null && !(this.forCrag != null)) {
      this.activityFiltersCragGQL
        .fetch({ id: this.filters.value.cragId })
        .pipe(take(1))
        .subscribe((crag) => (this.forCrag = crag.data.crag));
    }

    if (!(this.filters.value.cragId != null)) {
      this.forCrag = null;
    }
  }

  queryError(): void {
    this.error = {
      message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
    };
  }

  querySuccess(data: MyActivitiesQuery['myActivities']): void {
    this.activities = data.items;
    this.pagination = data.meta;
  }

  deleteActivity(activity: Activity) {
    this.authService.currentUser
      .pipe(
        concatMap((user) =>
          this.dialog
            .open(ConfirmationDialogComponent, {
              data: {
                title: 'Brisanje vnosa',
                message: `Si ${this.genderizeVerbPipe.transform(
                  'prepričan',
                  user.gender
                )}, da želiš izbrisati ta vnos?`,
                finePrint:
                  activity.type === 'crag' && activity.crag
                    ? `Z brisanjem vnosa boš ${this.genderizeVerbPipe.transform(
                        'pobrisal',
                        user.gender
                      )} tudi vse smeri v tem plezalnem dnevu.<br/>
                Če plezalni dan vsebuje vnos smeri, ki pomeni tvoj prvi uspešni vzpon v tej smeri, lahko pride do avtomatske spremembe tipa vzpona pri tvojih drugih vnosih za to smer.<br/>
                Če plezalni dan vsebuje vnos smeri, ki pomeni tvoj edini uspešni vzpon v tej smeri, boš s tem ${this.genderizeVerbPipe.transform(
                  'pobrisal',
                  user.gender
                )} tudi svoj glas o težavnosti te smeri in svojo oceno lepote te smeri.`
                    : null,
              },
            })
            .afterClosed()
        ),
        filter((response) => response != null),
        switchMap(() =>
          this.deleteActivityGQL.mutate(
            { id: activity.id },
            {
              refetchQueries: [namedOperations.Query.MyActivities],
            }
          )
        )
      )
      .subscribe({
        next: () => {
          this.snackbar.open('Vnos je bil uspešno izbrisan', null, {
            duration: 2000,
          });
        },
        error: () => {
          this.snackbar.open('Pri brisanju vnosa je prišlo do napake', null, {
            panelClass: 'error',
            duration: 3000,
          });
        },
      });
  }
}
