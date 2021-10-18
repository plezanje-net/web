import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  ASCENT_TYPES,
  PUBLISH_OPTIONS,
} from '../../../common/activity.constants';
import { gradeNames } from 'src/app/common/grade-names.constants';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Crag } from 'src/generated/graphql';

@Component({
  selector: 'app-activity-form-route',
  templateUrl: './activity-form-route.component.html',
  styleUrls: ['./activity-form-route.component.scss'],
})
export class ActivityFormRouteComponent implements OnInit, OnDestroy {
  @Input() activity = true;
  @Input() route: FormGroup;
  @Input() first: boolean;
  @Input() last: boolean;
  @Input() crag: Crag;
  @Output() move = new EventEmitter<number>();

  topRopeAscentTypes = ASCENT_TYPES.filter(ascentType => ascentType.topRope);
  nonTopRopeAscentTypes = ASCENT_TYPES.filter(ascentType => !ascentType.topRope);

  publishOptions = PUBLISH_OPTIONS;

  filteredGradesOptions: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);
  gradeFilterControl: FormControl = new FormControl();

  onDestroySubject = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
    this.populateGradesDropdown();

    this.gradeFilterControl.valueChanges
      .pipe(takeUntil(this.onDestroySubject))
      .subscribe(() => {
        this.populateGradesDropdown();
      });
  }

  ngOnDestroy(): void {
    this.onDestroySubject.next();
    this.onDestroySubject.complete();
  }

  populateGradesDropdown(): void {
    let search: string = this.gradeFilterControl.value;
    // TODO somehow use src/common/grade.ts instead of the gradeNames array
    if (search) {
      search = search.toLowerCase();

      this.filteredGradesOptions.next(gradeNames.filter(gradeName => gradeName.indexOf(search) > -1));
    } else {
      this.filteredGradesOptions.next(gradeNames.slice());
    }
  }
}
