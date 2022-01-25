import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivityRoute } from 'src/generated/graphql';
import { RowAction } from '../../pages/activity-log/activity-log.component';

@Component({
  selector: '[app-activity-route-row]',
  templateUrl: './activity-route-row.component.html',
  styleUrls: ['./activity-route-row.component.scss'],
})
export class ActivityRouteRowComponent implements OnInit {
  @Input() route: ActivityRoute;
  @Input() rowAction: Subject<RowAction>;
  @Input() displayType: 'activity' | 'routes' = 'routes';

  constructor() {}

  ngOnInit(): void {}
}
