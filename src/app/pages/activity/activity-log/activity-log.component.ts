import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/services/layout.service';
import { DataError } from 'src/app/types/data-error';
import { MyActivitiesGQL, MyActivitiesQuery } from 'src/generated/graphql';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss']
})
export class ActivityLogComponent implements OnInit {

  loading = true;
  error: DataError = null;

  activities: MyActivitiesQuery["myActivities"]["items"];

  constructor(
    private layoutService: LayoutService,
    private myActivitiesGQL: MyActivitiesGQL
  ) { }

  ngOnInit(): void {

    this.layoutService.$breadcrumbs.next([
      {
        name: "Plezalni dnevnik"
      }
    ])

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
