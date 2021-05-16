import { Component, Input, OnInit } from '@angular/core';
import { Registry } from 'src/app/types/registry';
import { ASCENT_TYPES } from '../activity.constants';

@Component({
  selector: 'app-ascent-type',
  templateUrl: './ascent-type.component.html',
  styleUrls: ['./ascent-type.component.scss'],
})
export class AscentTypeComponent implements OnInit {
  @Input() value: string;

  topRope = false;
  ascentType: Registry;

  constructor() {}

  ngOnInit(): void {
    let value = this.value;

    if (value.startsWith('t_')) {
      this.topRope = true;
      value = value.substring(2);
    }

    this.ascentType = ASCENT_TYPES.find((at) => at.value == value);
  }
}