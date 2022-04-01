import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { LayoutService } from 'src/app/services/layout.service';
import { DataError } from 'src/app/types/data-error';
import { Registry } from 'src/app/types/registry';
import { ActivityEntryGQL, ActivityEntryQuery } from 'src/generated/graphql';
import { ACTIVITY_TYPES } from '../../../common/activity.constants';

@Component({
  selector: 'app-activity-entry',
  templateUrl: './activity-entry.component.html',
  styleUrls: ['./activity-entry.component.scss'],
})
export class ActivityEntryComponent implements OnInit, OnDestroy {
  loading = false;
  type: 'view' | 'edit';
  error: DataError = null;

  activity: ActivityEntryQuery['activity'];
  activityType: Registry;

  subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private activityEntryGQL: ActivityEntryGQL,
    private layoutService: LayoutService,
    @Inject(LOCALE_ID) public locale: string
  ) {}

  ngOnInit(): void {
    const typeSub = this.activatedRoute.data.subscribe(
      ({ type }) => (this.type = type)
    );
    this.subscriptions.push(typeSub);

    const routeSub = this.activatedRoute.params
      .pipe(
        switchMap((params) => {
          this.loading = true;
          return this.activityEntryGQL.watch({
            id: params.id,
          }).valueChanges;
        })
      )
      .subscribe({
        next: (result) => {
          this.loading = false;
          this.activity = result.data.activity;

          this.activityType = ACTIVITY_TYPES.find(
            (t) => t.value == result.data.activity.type
          );

          this.layoutService.$breadcrumbs.next([
            {
              name: 'Plezalni dnevnik',
              path: 'plezalni-dnevnik',
            },
            {
              name:
                formatDate(this.activity.date, 'dd.MM.YYYY', this.locale) +
                ', ' +
                this.activityType.label +
                ': ' +
                this.activity.name,
            },
          ]);
        },
        error: () => {
          this.loading = false;
          this.error = {
            message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
          };
        },
      });

    this.subscriptions.push(routeSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
