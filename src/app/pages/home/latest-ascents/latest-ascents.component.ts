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
export class LatestAscentsComponent implements OnInit, OnDestroy {
  @Output() errorEvent = new EventEmitter<DataError>();

  activities: Activity[];
  loading = true;
  subscription: Subscription;

  constructor(
    private ascentsGQL: AscentsGQL,
    private loadingSpinnerService: LoadingSpinnerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Need to subscribe to user because user can logout on home and content should be refetched
    this.subscription = this.authService.currentUser
      .pipe(
        switchMap(() => {
          this.loadingSpinnerService.pushLoader();

          const gqlParams: {
            activitiesInput: FindActivitiesInput;
            activityRoutesInput: FindActivityRoutesInput;
          } = {
            activitiesInput: {
              type: ['crag'],
              hasRoutesWithPublish: ['public'],
              orderBy: { field: 'date', direction: 'DESC' },
              pageSize: 10,
            },
            activityRoutesInput: {
              publish: ['public'],
              orderBy: { field: 'orderScore', direction: 'DESC' },
            },
          };

          return this.ascentsGQL.fetch(gqlParams);
        })
      )
      .subscribe({
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
