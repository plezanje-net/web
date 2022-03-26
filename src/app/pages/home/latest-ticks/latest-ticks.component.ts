import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { DataError } from 'src/app/types/data-error';
import { ActivityRoute, LatestTicksGQL } from 'src/generated/graphql';
import { LoadingSpinnerService } from '../loading-spinner.service';

interface ILatestTicks {
  date: string;
  ticks: ActivityRoute[];
}

@Component({
  selector: 'app-latest-ticks',
  templateUrl: './latest-ticks.component.html',
  styleUrls: ['./latest-ticks.component.scss'],
})
export class LatestTicksComponent implements OnInit, OnDestroy {
  @Output() errorEvent = new EventEmitter<DataError>();

  loading = true;
  subscription: Subscription;

  latestTicks: ILatestTicks[] = [];

  constructor(
    private latestTicksGQL: LatestTicksGQL,
    private loadingSpinnerService: LoadingSpinnerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.currentUser
      .pipe(
        switchMap((user) => {
          this.loadingSpinnerService.pushLoader();
          return this.latestTicksGQL.fetch({ latestN: 10 });
        })
      )
      .subscribe({
        next: (result) => {
          this.latestTicks = [];
          this.loading = false;
          this.loadingSpinnerService.popLoader();

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
            this.latestTicks[this.latestTicks.length - 1].ticks.push(
              <ActivityRoute>tick
            );
          });
        },
        error: () => {
          this.loadingSpinnerService.popLoader();
          this.queryError();
        },
      });
  }

  queryError() {
    this.errorEvent.emit({
      message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

// TODO: redo design
