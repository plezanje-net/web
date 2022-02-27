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
import { ActivityFormService } from '../activity-form.service';

@Component({
  selector: 'app-activity-form-route',
  templateUrl: './activity-form-route.component.html',
  styleUrls: ['./activity-form-route.component.scss'],
})
export class ActivityFormRouteComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() myIndex: number;
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

  constructor(public activityFormService: ActivityFormService) {}

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

    // Should disable possibility to vote on route if ascent type not a tick.
    const ascentTypeSelected = this.route.get('ascentType').value;

    // If a route is a project then a vote on diff should always be cast.
    if (this.route.get('isProject').value) {
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
      this.route.get('votedDifficulty').addValidators(Validators.required);
    } else {
      this.route.get('votedDifficulty').clearValidators();
    }
    this.route.get('votedDifficulty').updateValueAndValidity();
  }

  /**
   * determines if a log could ever be possible based on route type and some ascent type
   *
   * @param ascentType
   * @returns boolean
   */
  logPossibleEver(ascentType: string) {
    if (
      this.route.value.type === 'boulder' &&
      ['onsight', 't_onsight'].includes(ascentType)
    ) {
      return false;
    }

    return true;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
