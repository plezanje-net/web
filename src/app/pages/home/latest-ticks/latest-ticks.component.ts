import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataError } from 'src/app/types/data-error';
import { LatestTicksGQL, LatestTicksQuery } from 'src/generated/graphql';
import { LoadingSpinnerService } from '../loading-spinner.service';

interface ILatestTicks {
  date: string;
  ticks: LatestTicksQuery['latestTicks'];
}

@Component({
  selector: 'app-latest-ticks',
  templateUrl: './latest-ticks.component.html',
  styleUrls: ['./latest-ticks.component.scss'],
})
export class LatestTicksComponent implements OnInit {
  @Output() errorEvent = new EventEmitter<DataError>();
  loading = true;

  latestTicks: ILatestTicks[] = [];

  constructor(
    private latestTicksGQL: LatestTicksGQL,
    private loadingSpinnerService: LoadingSpinnerService
  ) {}

  ngOnInit(): void {
    this.loadingSpinnerService.pushLoader();
    this.latestTicksGQL
      .fetch({ latest: 10 })
      .toPromise()
      .then(
        (result) => {
          this.loading = false;
          this.loadingSpinnerService.popLoader();
          if (result.errors == null) {
            let currDate = '';
            result.data.latestTicks.forEach((tick) => {
              // we assume dates of ticks are in desc order
              if (currDate != tick.activity.date) {
                currDate = tick.activity.date;
                this.latestTicks.push({
                  date: currDate,
                  ticks: [],
                });
              }
              this.latestTicks[this.latestTicks.length - 1].ticks.push(tick);
            });
          } else {
            this.queryError();
          }
        },
        (_error) => {
          this.loadingSpinnerService.popLoader();
          this.queryError();
        }
      );
  }

  queryError() {
    this.errorEvent.emit({
      message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
    });
  }
}

// TODO: redo design