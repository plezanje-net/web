import { Component, OnInit } from '@angular/core';
import { GraphQLError } from 'graphql';
import { DataError } from 'src/app/types/data-error';
import { MyActivitiesGQL, MyActivitiesQuery } from 'src/generated/graphql';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss']
})
export class ActivityListComponent implements OnInit {

  loading = true;
  error: DataError = null;

  activities: MyActivitiesQuery["myActivities"]["items"];

  constructor(
    private myActivitiesGQL: MyActivitiesGQL
  ) { }

  ngOnInit(): void {
    this.myActivitiesGQL.fetch().subscribe(result => {
      this.loading = false;

      if (result.errors != null) {
        this.queryError()
      } else {
        this.querySuccess(result.data.myActivities);
      }
    })
  }

  queryError(): void {
    this.error = {
      message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.'
    };
  }

  querySuccess(data: MyActivitiesQuery['myActivities']): void {
    this.activities = data.items;
  }

}
