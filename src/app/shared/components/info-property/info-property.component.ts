import { Component, Input, OnInit } from '@angular/core';
import { RouteProperty } from 'src/generated/graphql';

@Component({
  selector: 'app-info-property',
  templateUrl: './info-property.component.html',
  styleUrls: ['./info-property.component.scss'],
})
export class InfoPropertyComponent implements OnInit {
  @Input() property: RouteProperty;

  displayValue: string;
  htmlValue: string;
  url: string;

  constructor() {}

  ngOnInit(): void {
    switch (this.property.propertyType.valueType) {
      case 'string':
        this.displayValue = this.property.stringValue;
        break;
      case 'text':
        this.htmlValue = this.property.textValue;
        break;
      case 'time':
        // TODO: nice display
        this.displayValue = this.property.numValue + 'h';
      case 'number':
        this.displayValue = this.property.numValue + '';
        break;
      case 'url':
        this.url = this.property.stringValue;
        break;
      default:
        this.displayValue = this.property.stringValue;
    }
  }
}
