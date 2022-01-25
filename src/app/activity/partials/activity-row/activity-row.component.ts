import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Activity } from 'src/generated/graphql';

import { ACTIVITY_TYPES } from '../../../common/activity.constants';
import { RowAction } from '../../pages/activity-log/activity-log.component';

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
