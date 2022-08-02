import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { LayoutService } from 'src/app/services/layout.service';
import { DataError } from 'src/app/types/data-error';
import {
  Activity,
  FindActivitiesInput,
  FindActivityRoutesInput,
  AscentsGQL,
  PaginationMeta,
} from 'src/generated/graphql';

@Component({
  selector: 'app-ascents-history',
  templateUrl: './ascents-history.component.html',
  styleUrls: ['./ascents-history.component.scss'],
})
export class AscentsHistoryComponent implements OnInit, OnDestroy {
  activities: Activity[];

  pagination: PaginationMeta;
  loading = false;
  error: DataError = null;
  subscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private layoutService: LayoutService,
    private ascentsGQL: AscentsGQL
  ) {}

  ngOnInit(): void {
    this.layoutService.$breadcrumbs.next([
      {
        // path: '/pregledi',
        name: 'Pregledi',
      },
      { name: 'Zgodovina vzponov' },
    ]);

    this.subscription = this.activatedRoute.params
      .pipe(
        switchMap((params) => {
          this.loading = true;
          const gqlParams: {
            activitiesInput: FindActivitiesInput;
            activityRoutesInput: FindActivityRoutesInput;
          } = {
            activitiesInput: {
              type: ['crag'],
              hasRoutesWithPublish: ['public'],
            },
            activityRoutesInput: {
              publish: ['public'],
              orderBy: { field: 'score', direction: 'DESC' },
            },
          };

          if (params.pageNumber) {
            gqlParams.activitiesInput.pageNumber = +params.pageNumber;
          }

          return this.ascentsGQL.fetch(gqlParams);
        })
      )
      .subscribe({
        next: (result) => {
          this.loading = false;
          this.activities = <Activity[]>result.data.activities.items;
          this.pagination = result.data.activities.meta;
        },
        error: () => {
          this.loading = false;
          this.error = {
            message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
          };
        },
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  paginate(event: PageEvent) {
    this.router.navigate([
      '/pregledi/vzponi',
      event.pageIndex > 0 ? { pageNumber: event.pageIndex + 1 } : {},
    ]);
  }
}
