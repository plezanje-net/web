import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LayoutService } from 'src/app/services/layout.service';
import { DataError } from 'src/app/types/data-error';
import {
  MyActivitiesGQL,
  MyActivitiesQuery,
  MyActivitiesQueryVariables,
} from 'src/generated/graphql';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss'],
})
export class ActivityLogComponent implements OnInit {
  loading = true;
  error: DataError = null;

  activities: MyActivitiesQuery['myActivities']['items'];
  pagination: MyActivitiesQuery['myActivities']['meta'];

  queryParams = new Subject<MyActivitiesQueryVariables>();

  constructor(
    private layoutService: LayoutService,
    private myActivitiesGQL: MyActivitiesGQL
  ) {}

  ngOnInit(): void {
    this.layoutService.$breadcrumbs.next([
      {
        name: 'Plezalni dnevnik',
      },
    ]);

    this.queryParams.pipe(debounceTime(300)).subscribe((params) => {
      this.loading = true;
      this.myActivitiesGQL
        .fetch({ pageNumber: params.pageNumber })
        .subscribe((result) => {
          this.loading = false;

          if (result.errors != null) {
            this.queryError();
          } else {
            this.querySuccess(result.data.myActivities);
          }
        });
    });

    this.queryParams.next({ pageNumber: 1 });
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

  paginate(event: PageEvent) {
    this.queryParams.next({ pageNumber: event.pageIndex + 1 });
  }
}
