import { query } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import moment, { Moment } from 'moment';
import { Subject } from 'rxjs';
import { debounce, debounceTime, take } from 'rxjs/operators';
import {
  ASCENT_TYPES,
  PUBLISH_OPTIONS,
} from 'src/app/common/activity.constants';
import { LayoutService } from 'src/app/services/layout.service';
import { DataError } from 'src/app/types/data-error';
import {
  ActivityRoute,
  Crag,
  FindActivityRoutesInput,
  MyActivityRoutesGQL,
  MyActivityRoutesQuery,
  ActivityFiltersCragGQL,
  ActivityFiltersCragQuery,
  ActivityFiltersRouteGQL,
  ActivityFiltersRouteQuery,
  Route,
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
export class ActivityRoutesComponent implements OnInit {
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
      { name: 'publish', label: 'Objava' },
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

  rowAction$ = new Subject<RowAction>();

  ascentTypes = ASCENT_TYPES;
  publishOptions = PUBLISH_OPTIONS;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private myActivityRoutesGQL: MyActivityRoutesGQL,
    private activityFiltersCragGQL: ActivityFiltersCragGQL,
    private activityFiltersRouteGQL: ActivityFiltersRouteGQL
  ) {}

  ngOnInit(): void {
    this.layoutService.$breadcrumbs.next([
      {
        name: 'Plezalni dnevnik',
      },
    ]);

    const ft = this.filteredTable;

    ft.navigate$.subscribe((params) =>
      this.router.navigate(['/plezalni-dnevnik/vzponi', params])
    );

    this.activatedRoute.params.subscribe((params) => {
      ft.setRouteParams(params);

      this.filters.patchValue(ft.filterParams);

      this.applyRelationFilterDisplayValues();

      this.loading = true;

      const queryParams: FindActivityRoutesInput = ft.queryParams;

      this.myActivityRoutesGQL
        .watch({ input: queryParams })
        .valueChanges.subscribe((result) => {
          this.loading = false;
          ft.navigating = false;

          if (result.errors != null) {
            this.queryError();
          } else {
            this.querySuccess(result.data.myActivityRoutes);
          }
        });
    });

    this.filters.valueChanges.subscribe((values) => {
      if (ft.navigating) {
        ft.navigating = false;
      } else {
        ft.setFilterParams(values);
      }
    });

    this.rowAction$.subscribe((action) => {
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
      }
    });
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

  queryError(): void {
    this.error = {
      message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
    };
  }

  querySuccess(data: MyActivityRoutesQuery['myActivityRoutes']): void {
    this.routes = data.items;
    this.pagination = data.meta;
  }
}
