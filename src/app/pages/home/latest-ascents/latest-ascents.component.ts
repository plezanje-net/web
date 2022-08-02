import { Component, OnInit } from '@angular/core';
import {
  Activity,
  AscentsGQL,
  FindActivitiesInput,
  FindActivityRoutesInput,
} from 'src/generated/graphql';

@Component({
  selector: 'app-latest-ascents',
  templateUrl: './latest-ascents.component.html',
  styleUrls: ['./latest-ascents.component.scss'],
})
export class LatestAscentsComponent implements OnInit {
  activities: Activity[];
  loading = true;

  constructor(private ascentsGQL: AscentsGQL) {}

  ngOnInit(): void {
    const gqlParams: {
      activitiesInput: FindActivitiesInput;
      activityRoutesInput: FindActivityRoutesInput;
    } = {
      activitiesInput: {
        type: ['crag'],
        hasRoutesWithPublish: ['public'],
        pageSize: 10,
      },
      activityRoutesInput: {
        publish: ['public'],
        orderBy: { field: 'score', direction: 'DESC' },
      },
    };

    this.ascentsGQL.fetch(gqlParams).subscribe({
      next: (result) => {
        this.activities = <Activity[]>result.data.activities.items;
        console.log(this.activities);
        this.loading = false;
      },
      error: () => {
        // this.error = {
        //   message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
        // };
      },
    });
  }
}
