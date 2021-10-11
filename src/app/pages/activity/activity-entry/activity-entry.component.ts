import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GraphQLError } from 'graphql';
import { DataError } from 'src/app/types/data-error';
import { Registry } from 'src/app/types/registry';
import { ActivityEntryGQL, ActivityEntryQuery } from 'src/generated/graphql';
import { ACTIVITY_TYPES } from '../../../common/activity.constants';

@Component({
  selector: 'app-activity-entry',
  templateUrl: './activity-entry.component.html',
  styleUrls: ['./activity-entry.component.scss'],
})
export class ActivityEntryComponent implements OnInit {
  loading = false;

  error: DataError = null;

  activity: ActivityEntryQuery['activity'];
  activityType: Registry;

  constructor(
    private activatedRoute: ActivatedRoute,
    private activityEntryGQL: ActivityEntryGQL
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.loading = true;

      this.activityEntryGQL
        .watch({
          id: params.id,
        })
        .valueChanges.subscribe((result) => {
          this.loading = false;

          if (result.errors != null) {
            this.queryError();
          } else {
            this.querySuccess(result.data.activity);
          }
        });
    });
  }

  queryError() {
    this.error = {
      message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
    };
  }

  querySuccess(activity: ActivityEntryQuery['activity']) {
    this.activity = activity;

    this.activityType = ACTIVITY_TYPES.find((t) => t.value == activity.type);
  }
}
