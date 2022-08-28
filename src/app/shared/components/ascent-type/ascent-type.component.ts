import { Component, Input, OnInit } from '@angular/core';
import { Registry } from 'src/app/types/registry';
import { ASCENT_TYPES } from '../../../common/activity.constants';

@Component({
  selector: 'app-ascent-type',
  templateUrl: './ascent-type.component.html',
  styleUrls: ['./ascent-type.component.scss'],
})
export class AscentTypeComponent implements OnInit {
  @Input() value: string;
  @Input() displayType = 'text';
  @Input() iconAlignment = 'end';
  @Input() fixedIconsWidth = true;

  ascentType: Registry;

  constructor() {}

  ngOnInit(): void {
    this.ascentType = ASCENT_TYPES.find((at) => at.value === this.value);
  }
}
