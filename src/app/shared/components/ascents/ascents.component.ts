import { Component, Input, OnInit } from '@angular/core';
import { ASCENT_TYPES } from 'src/app/common/activity.constants';
import { Activity } from 'src/generated/graphql';

@Component({
  selector: 'app-ascents',
  templateUrl: './ascents.component.html',
  styleUrls: ['./ascents.component.scss'],
})
export class AscentsComponent implements OnInit {
  @Input() activities: Activity[];
  @Input() forceCompact = false;

  activityMainRows: { expanded: boolean }[] = [];
  ascentTypes = ASCENT_TYPES;
  noTopropeOnPage = false;

  constructor() {}

  ngOnInit(): void {
    this.activityMainRows = [];

    this.activities.forEach(() => {
      this.activityMainRows.push({ expanded: false });
    });

    // We don't need to decide about this detail if compact view is forced
    if (!this.forceCompact) {
      this.noTopropeOnPage = !this.activities.some((activity) =>
        activity.routes.some(
          (route) =>
            this.ascentTypes.find((at) => at.value === route.ascentType).topRope
        )
      );
    }
  }
}
