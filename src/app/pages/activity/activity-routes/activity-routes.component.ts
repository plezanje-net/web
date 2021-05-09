import { query } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import moment, { Moment } from 'moment';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  ASCENT_TYPES,
  PUBLISH_OPTIONS,
} from 'src/app/common/activity.constants';
import { LayoutService } from 'src/app/services/layout.service';
import { DataError } from 'src/app/types/data-error';
import {
  FindActivityRoutesInput,
  MyActivityRoutesGQL,
  MyActivityRoutesQuery,
  MyActivityRoutesQueryVariables,
} from 'src/generated/graphql';
import { FilteredTable } from '../../../common/filtered-table';

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
  });

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
    ]
  );

  ascentTypes = ASCENT_TYPES;
  publishOptions = PUBLISH_OPTIONS;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private myActivityRoutesGQL: MyActivityRoutesGQL
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

    this.activatedRoute.params.pipe(debounceTime(300)).subscribe((params) => {
      ft.setRouteParams(params);

      this.filters.patchValue(ft.filterParams, { emitEvent: false });

      this.loading = true;

      const queryParams: FindActivityRoutesInput = ft.queryParams;

      this.myActivityRoutesGQL
        .fetch({ input: queryParams })
        .subscribe((result) => {
          this.loading = false;

          if (result.errors != null) {
            this.queryError();
          } else {
            this.querySuccess(result.data.myActivityRoutes);
          }
        });
    });

    this.filters.valueChanges.pipe(debounceTime(600)).subscribe((values) => {
      ft.setFilterParams(values);
    });
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
