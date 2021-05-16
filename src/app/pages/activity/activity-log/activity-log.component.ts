import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ACTIVITY_TYPES } from 'src/app/common/activity.constants';
import { FilteredTable } from 'src/app/common/filtered-table';
import { LayoutService } from 'src/app/services/layout.service';
import { DataError } from 'src/app/types/data-error';
import {
  Activity,
  ActivityFiltersCragGQL,
  ActivityFiltersCragQuery,
  FindActivitiesInput,
  MyActivitiesGQL,
  MyActivitiesQuery,
  MyActivitiesQueryVariables,
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
export class ActivityLogComponent implements OnInit {
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
      { name: 'nrRoutes', label: 'Št. smeri' },
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

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private myActivitiesGQL: MyActivitiesGQL,
    private activityFiltersCragGQL: ActivityFiltersCragGQL
  ) {}

  ngOnInit(): void {
    this.layoutService.$breadcrumbs.next([
      {
        name: 'Plezalni dnevnik',
      },
    ]);

    const ft = this.filteredTable;

    ft.navigate$.subscribe((params) =>
      this.router.navigate(['/plezalni-dnevnik', params])
    );

    this.activatedRoute.params.subscribe((params) => {
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
          this.forCrag = action.item.crag;
          this.filters.patchValue({
            cragId: action.item.crag.id,
          });
          break;
      }
    });
  }

  applyRelationFilterDisplayValues() {
    if (this.filters.value.cragId != null && !(this.forCrag != null)) {
      this.activityFiltersCragGQL
        .fetch({ id: this.filters.value.cragId })
        .toPromise()
        .then((crag) => (this.forCrag = crag.data.crag));
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
}
