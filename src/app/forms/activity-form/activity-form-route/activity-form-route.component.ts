import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import {
  ASCENT_TYPES,
  PublishOptionsEnum,
  PUBLISH_OPTIONS,
} from '../../../common/activity.constants';
import { Crag } from 'src/generated/graphql';
import { Subject, takeUntil } from 'rxjs';

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
        const votedDifficultyControl = this.route.controls.votedDifficulty;

        if (
          publish === PublishOptionsEnum.private &&
          !votedDifficultyControl.disabled
        ) {
          votedDifficultyControl.reset();
          votedDifficultyControl.disable();
        } else {
          if (votedDifficultyControl.disabled) {
            votedDifficultyControl.enable();
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

  /**
   *
   * @param ascentTypeSelected
   *
   * Make voting on difficulty possible only if a user is ticking a route
   */
  conditionallyDisableVotedDifficulty(ascentTypeSelected: string) {
    const isTick = ASCENT_TYPES.some(
      (at) => at.value === ascentTypeSelected && at.tick
    );

    // Only if route is being newly ticked or repeated (which also is a tick) can one cast a vote on difficulty (i.e. new vote or modifying existing one)
    if (isTick) {
      this.route.get('votedDifficulty').enable();
    } else {
      this.route.get('votedDifficulty').setValue(null);
      this.route.get('votedDifficulty').disable();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
