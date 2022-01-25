import { Component, Input, OnInit } from '@angular/core';
import { Registry } from 'src/app/types/registry';
import { PUBLISH_OPTIONS } from '../../../common/activity.constants';

@Component({
  selector: 'app-ascent-publish-option',
  templateUrl: './ascent-publish-option.component.html',
  styleUrls: ['./ascent-publish-option.component.scss'],
})
export class AscentPublishOptionComponent implements OnInit {
  @Input() value: string;

  publishOption: Registry;

  constructor() {}

  ngOnInit(): void {
    this.publishOption = PUBLISH_OPTIONS.find((at) => at.value == this.value);
  }
}
