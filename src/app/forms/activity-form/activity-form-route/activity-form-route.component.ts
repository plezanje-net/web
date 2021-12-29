import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  ASCENT_TYPES,
  PublishOptionsEnum,
  PUBLISH_OPTIONS,
} from '../../../common/activity.constants';
import { Crag } from 'src/generated/graphql';

@Component({
  selector: 'app-activity-form-route',
  templateUrl: './activity-form-route.component.html',
  styleUrls: ['./activity-form-route.component.scss'],
})
export class ActivityFormRouteComponent implements OnInit {
  @Input() activity = true;
  @Input() route: FormGroup;
  @Input() first: boolean;
  @Input() last: boolean;
  @Input() crag: Crag;
  @Output() move = new EventEmitter<number>();

  topRopeAscentTypes = ASCENT_TYPES.filter((ascentType) => ascentType.topRope);
  nonTopRopeAscentTypes = ASCENT_TYPES.filter(
    (ascentType) => !ascentType.topRope
  );
  publishOptions = PUBLISH_OPTIONS;

  constructor() {}

  ngOnInit(): void {
    this.route.controls.publish.valueChanges.subscribe(
      (publish: PublishOptionsEnum) => {
        const gradeSuggestionControl = this.route.controls.gradeSuggestion;

        if (
          publish === PublishOptionsEnum.private &&
          !gradeSuggestionControl.disabled
        ) {
          gradeSuggestionControl.disable();
        } else {
          if (gradeSuggestionControl.disabled) {
            gradeSuggestionControl.enable();
          }
        }
      }
    );
  }
}
