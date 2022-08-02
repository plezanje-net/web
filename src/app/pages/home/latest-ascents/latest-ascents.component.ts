import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataError } from 'src/app/types/data-error';
import {
  Activity,
  AscentsGQL,
  FindActivitiesInput,
  FindActivityRoutesInput,
} from 'src/generated/graphql';
import { LoadingSpinnerService } from '../loading-spinner.service';

@Component({
  selector: 'app-latest-ascents',
  templateUrl: './latest-ascents.component.html',
  styleUrls: ['./latest-ascents.component.scss'],
})
export class LatestAscentsComponent implements OnInit {
  @Output() errorEvent = new EventEmitter<DataError>();

  activities: Activity[];
  loading = true;

  constructor(
    private ascentsGQL: AscentsGQL,
    private loadingSpinnerService: LoadingSpinnerService
  ) {}

  ngOnInit(): void {
    this.loadingSpinnerService.pushLoader();

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
        this.loadingSpinnerService.popLoader();
        this.activities = <Activity[]>result.data.activities.items;
        this.loading = false;
      },
      error: () => {
        this.loadingSpinnerService.popLoader();
        this.errorEvent.emit({
          message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
        });
      },
    });
  }
}
