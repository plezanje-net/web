import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { PUBLISH_OPTIONS } from 'src/app/common/activity.constants';
import {
  ActivityRoute,
  ActivityRouteChangePublishGQL,
} from 'src/generated/graphql';
import { RowAction } from '../../pages/activity-log/activity-log.component';

@Component({
  selector: '[app-activity-route-row]',
  templateUrl: './activity-route-row.component.html',
  styleUrls: ['./activity-route-row.component.scss'],
})
export class ActivityRouteRowComponent implements OnInit {
  @Input() route: ActivityRoute;
  @Input() rowAction: Subject<RowAction>;
  @Input() displayType: 'activity' | 'activityForm' | 'routes' = 'routes';
  @Input() noNotes = false;
  publishOptions = PUBLISH_OPTIONS;

  constructor(
    private activityRouteChangePublishGQL: ActivityRouteChangePublishGQL,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  changePublish(value: string) {
    this.activityRouteChangePublishGQL
      .mutate({
        input: { id: this.route.id, publish: value },
      })
      .subscribe({
        next: () => {
          this.snackbar.open('Vidnost vzpona je bila spremenjena', null, {
            duration: 2000,
          });
        },
        error: () => {
          this.snackbar.open('Vidnosti ni bilo mogoče spremeniti', null, {
            panelClass: 'error',
            duration: 3000,
          });
        },
      });
  }
}
