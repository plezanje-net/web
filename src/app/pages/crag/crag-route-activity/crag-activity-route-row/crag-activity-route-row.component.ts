import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { PUBLISH_OPTIONS } from 'src/app/common/activity.constants';
import {
  ActivityRoute,
  ActivityRouteChangePublishGQL,
} from 'src/generated/graphql';

@Component({
  selector: '[app-crag-activity-route-row]',
  templateUrl: './crag-activity-route-row.component.html',
  styleUrls: ['./crag-activity-route-row.component.scss'],
})
export class CragActivityRouteRowComponent implements OnInit {
  @Input() route: ActivityRoute;
  @Input() displayType: 'activity' | 'activityForm' | 'routes' = 'routes';
  @Input() noNotes = false;
  @Input() noTopropeOnPage = false;

  publishOptions = PUBLISH_OPTIONS;

  constructor(
  ) {}

  ngOnInit(): void {

  }

}
