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
  highestDifficulty: number;
  highestDiffGradingSystemId: string;
  totalLength: number;

  constructor() {}

  ngOnInit(): void {
    this.type =
      ACTIVITY_TYPES.find((a) => a.value == this.activity.type).label ||
      'Ostalo';

    let totalLength = 0;
    let highestDifficulty = Number.MIN_SAFE_INTEGER;
    let highestDiffGradingSystemId: string;

    this.activity.routes.forEach((ar) => {
      if (
        ar.route.difficulty > highestDifficulty &&
        ar.ascentType !== 'attempt' &&
        ar.ascentType !== 't_attempt'
      ) {
        highestDifficulty = ar.route.difficulty;
        highestDiffGradingSystemId = ar.route.defaultGradingSystem.id;
      }

      if (!isNaN(Number(ar.route.length))) {
        totalLength += Number(ar.route.length);
      }
    });

    this.totalLength = totalLength;
    this.highestDifficulty = highestDifficulty;
    this.highestDiffGradingSystemId = highestDiffGradingSystemId;
  }
}
