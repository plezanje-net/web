import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  ASCENT_TYPES,
  PUBLISH_OPTIONS,
} from '../../../common/activity.constants';

@Component({
  selector: 'app-activity-form-route',
  templateUrl: './activity-form-route.component.html',
  styleUrls: ['./activity-form-route.component.scss'],
})
export class ActivityFormRouteComponent implements OnInit {
  @Input() activity: boolean = true;
  @Input() route: FormGroup;
  @Input() first: boolean;
  @Input() last: boolean;
  @Output() move = new EventEmitter<number>();

  ascentTypes = ASCENT_TYPES;

  publishOptions = PUBLISH_OPTIONS;

  constructor() {}

  ngOnInit(): void {}
}
