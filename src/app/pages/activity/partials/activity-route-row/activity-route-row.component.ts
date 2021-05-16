import { Component, Input, OnInit } from '@angular/core';
import { ActivityRoute } from 'src/generated/graphql';

@Component({
  selector: '[app-activity-route-row]',
  templateUrl: './activity-route-row.component.html',
  styleUrls: ['./activity-route-row.component.scss'],
})
export class ActivityRouteRowComponent implements OnInit {
  @Input() route: ActivityRoute;

  constructor() {}

  ngOnInit(): void {}
}
