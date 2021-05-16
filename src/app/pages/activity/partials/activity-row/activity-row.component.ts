import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Activity } from 'src/generated/graphql';
import { RowAction } from '../../activity-log/activity-log.component';

import { ACTIVITY_TYPES } from '../../../../common/activity.constants';

@Component({
  selector: '[app-activity-row]',
  templateUrl: './activity-row.component.html',
  styleUrls: ['./activity-row.component.scss'],
})
export class ActivityRowComponent implements OnInit {
  @Input() activity: Activity;
  @Input() rowAction: Subject<RowAction>;

  type: string;

  constructor() {}

  ngOnInit(): void {
    this.type =
      ACTIVITY_TYPES.find((a) => a.value == this.activity.type).label ||
      'Ostalo';
  }
}
