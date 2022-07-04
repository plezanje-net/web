import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import {
  concatMap,
  debounceTime,
  filter,
  Subject,
  Subscription,
  switchMap,
  take,
} from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import {
  ASCENT_TYPES,
  PUBLISH_OPTIONS,
} from 'src/app/common/activity.constants';
import { LayoutService } from 'src/app/services/layout.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { GenderizeVerbPipe } from 'src/app/shared/pipes/genderize-verb.pipe';
import { DataError } from 'src/app/types/data-error';
import {
  ActivityRoute,
  FindActivityRoutesInput,
  MyActivityRoutesGQL,
  MyActivityRoutesQuery,
  ActivityFiltersCragGQL,
  ActivityFiltersCragQuery,
  ActivityFiltersRouteGQL,
  ActivityFiltersRouteQuery,
  namedOperations,
  DeleteActivityRouteGQL,
} from 'src/generated/graphql';
import { FilteredTable } from '../../../common/filtered-table';

export interface RowAction {
  item: ActivityRoute;
  action: string;
}

@Component({
  selector: 'app-activity-routes',
  templateUrl: './activity-routes.component.html',
  styleUrls: ['./activity-routes.component.scss'],
})
export class ActivityRoutesComponent implements OnInit, OnDestroy {
  error: DataError = null;

  routes: MyActivityRoutesQuery['myActivityRoutes']['items'];
  pagination: MyActivityRoutesQuery['myActivityRoutes']['meta'];

  loading = false;

  filters = new FormGroup({
    dateFrom: new FormControl(),
    dateTo: new FormControl(),
    ascentType: new FormControl(),
    publish: new FormControl(),
    cragId: new FormControl(),
    routeId: new FormControl(),
  });

  forCrag: ActivityFiltersCragQuery['crag'];
  forRoute: ActivityFiltersRouteQuery['route'];

  filteredTable = new FilteredTable(
    [
      { name: 'date', label: 'Datum', sortable: true, defaultSort: 'DESC' },
      { name: 'crag', label: 'Plezališče' },
      { name: 'route', label: 'Smer' },
      { name: 'grade', label: 'Ocena', sortable: true },
      { name: 'ascentType', label: 'Vrsta vzpona' },
      { name: 'notes', label: 'Opombe' },
      { name: 'publish', label: 'Vidnost' },
    ],
    [
      { name: 'dateFrom', type: 'date' },
      { name: 'dateTo', type: 'date' },
      { name: 'ascentType', type: 'multiselect' },
      { name: 'publish', type: 'multiselect' },
      { name: 'cragId', type: 'relation' },
      { name: 'routeId', type: 'relation' },
    ]
  );
  ignoreFormChange = true;

  rowAction$ = new Subject<RowAction>();

  ascentTypes = ASCENT_TYPES;
  publishOptions = PUBLISH_OPTIONS;

  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private genderizeVerbPipe: GenderizeVerbPipe,
    private myActivityRoutesGQL: MyActivityRoutesGQL,
    private activityFiltersCragGQL: ActivityFiltersCragGQL,
    private activityFiltersRouteGQL: ActivityFiltersRouteGQL,
    private deleteActivityRouteGQL: DeleteActivityRouteGQL
  ) {}

  ngOnInit(): void {
    this.layoutService.$breadcrumbs.next([
      {
        name: 'Plezalni dnevnik',
      },
    ]);

    const ft = this.filteredTable;

    const navSub = ft.navigate$.subscribe((params) =>
      this.router.navigate(['/plezalni-dnevnik/vzponi', params])
    );
    this.subscriptions.push(navSub);

    const routeParamsSub = this.activatedRoute.params
      .pipe(
        switchMap((params) => {
          ft.setRouteParams(params);

          this.ignoreFormChange = true;
          this.filters.patchValue(ft.filterParams, { emitEvent: false });

          this.applyRelationFilterDisplayValues();

          this.loading = true;

          const queryParams: FindActivityRoutesInput = ft.queryParams;

          return this.myActivityRoutesGQL.watch({ input: queryParams })
            .valueChanges;
        })
      )
      .subscribe({
        next: (result) => {
          this.loading = false;
          ft.navigating = false;
          this.ignoreFormChange = false;
          this.querySuccess(result.data.myActivityRoutes);
        },
        error: () => {
          this.queryError();
        },
      });

    this.subscriptions.push(routeParamsSub);

    const filtersSub = this.filters.valueChanges
      .pipe(
        filter(() => {
          return !this.ignoreFormChange; // date picker ignores emitEvent:false. This is a workaround
        }),
        debounceTime(100) // datepicker triggers 4 valueChanges events. this is a workaround
      )
      .subscribe((values) => {
        if (ft.navigating) {
          ft.navigating = false;
        } else {
          ft.setFilterParams(values);
        }
      });
    this.subscriptions.push(filtersSub);

    const rowActionsSub = this.rowAction$.subscribe((action) => {
      switch (action.action) {
        case 'filterByCrag':
          this.forCrag = action.item.route.crag;
          this.filters.patchValue({
            routeId: null,
            cragId: action.item.route.crag.id,
          });
          break;
        case 'filterByRoute':
          this.filters.patchValue({
            cragId: null,
            routeId: action.item.route.id,
          });
          break;
        case 'delete':
          this.deleteActivityRoute(action.item);
          break;
      }
    });
    this.subscriptions.push(rowActionsSub);
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

    if (this.filters.value.routeId != null && !(this.forRoute != null)) {
      this.activityFiltersRouteGQL
        .fetch({ id: this.filters.value.routeId })
        .pipe(take(1))
        .subscribe((route) => (this.forRoute = route.data.route));
    }

    if (this.filters.value.routeId == null) {
      this.forRoute = null;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  queryError(): void {
    this.error = {
      message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
    };
  }

  querySuccess(data: MyActivityRoutesQuery['myActivityRoutes']): void {
    this.routes = data.items;
    this.pagination = data.meta;
  }

  deleteActivityRoute(activityRoute: ActivityRoute) {
    this.authService.currentUser
      .pipe(
        concatMap((user) => {
          let finePrint = '';

          finePrint += ['redpoint', 'flash', 'onsight'].includes(
            activityRoute.ascentType
          )
            ? `Ker je to tvoj prvi uspešni vzpon v tej smeri, lahko pride do avtomatske spremembe tipa vzpona pri tvojih drugih vnosih za to smer.`
            : '';

          finePrint += ['t_redpoint', 't_flash', 't_onsight'].includes(
            activityRoute.ascentType
          )
            ? `Ker je to tvoj prvi uspešni toprope vzpon v tej smeri, lahko pride do avtomatske spremembe tipa vzpona pri tvojih drugih vnosih za to smer.`
            : '';

          finePrint += ['redpoint', 'flash', 'onsight'].includes(
            activityRoute.ascentType
          )
            ? `<br/>
            Če je to tvoj edini uspešni vzpon v tej smeri, boš s tem ${this.genderizeVerbPipe.transform(
              'pobrisal',
              user.gender
            )} tudi svoj glas o težavnosti te smeri in svojo oceno lepote te smeri.`
            : ``;

          return this.dialog
            .open(ConfirmationDialogComponent, {
              data: {
                title: 'Brisanje vzpona',
                message: `Si ${this.genderizeVerbPipe.transform(
                  'prepričan',
                  user.gender
                )}, da želiš izbrisati ta vzpon?`,
                finePrint: finePrint,
              },
            })
            .afterClosed();
        }),
        filter((response) => response != null),
        switchMap(() =>
          this.deleteActivityRouteGQL.mutate(
            { id: activityRoute.id },
            {
              refetchQueries: [namedOperations.Query.MyActivityRoutes],
            }
          )
        )
      )
      .subscribe({
        next: () => {
          this.snackbar.open('Vzpon je bil uspešno izbrisan', null, {
            duration: 2000,
          });
        },
        error: () => {
          this.snackbar.open('Pri brisanju vzpona je prišlo do napake', null, {
            panelClass: 'error',
            duration: 3000,
          });
        },
      });
  }
}
