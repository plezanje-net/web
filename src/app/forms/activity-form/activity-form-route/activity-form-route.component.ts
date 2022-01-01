import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { takeUntil } from 'rxjs';
import { FormGroup, Validators } from '@angular/forms';
import {
  ASCENT_TYPES,
  PublishOptionsEnum,
  PUBLISH_OPTIONS,
} from '../../../common/activity.constants';
import { Crag } from 'src/generated/graphql';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-activity-form-route',
  templateUrl: './activity-form-route.component.html',
  styleUrls: ['./activity-form-route.component.scss'],
})
export class ActivityFormRouteComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

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
    this.route.controls.publish.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((publish: PublishOptionsEnum) => {
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
      });

    if (this.route.get('isProject').value) {
      const ascentTypeSelected = this.route.get('ascentType').value;
      this.conditionallyRequireVotedDifficulty(ascentTypeSelected);

      this.route
        .get('ascentType')
        .valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((at) => this.conditionallyRequireVotedDifficulty(at));
    }
  }

  /**
   *
   * @param ascentTypeSelected
   *
   * If a route is a project and selected ascent type means that the route has been ticked, then a vote on grade is mandatory.
   */
  conditionallyRequireVotedDifficulty(ascentTypeSelected: string) {
    const isTick = ASCENT_TYPES.some(
      (at) => at.value === ascentTypeSelected && at.tick
    );
    if (isTick) {
      this.route.get('gradeSuggestion').addValidators(Validators.required);
    } else {
      this.route.get('gradeSuggestion').clearValidators();
    }
    this.route.get('gradeSuggestion').updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
