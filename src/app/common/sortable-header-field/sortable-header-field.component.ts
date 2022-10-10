import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sortable-header-field',
  templateUrl: './sortable-header-field.component.html',
  styleUrls: ['./sortable-header-field.component.scss'],
})
export class SortableHeaderFieldComponent implements OnInit {
  @Input() field: string;
  @Input() label?: string;
  @Input() icon?: string;
  @Input() svgIcon?: string;
  @Input() centered = false;
  @Input() sortIndication: 'highlight' | 'arrows';
  @Input() currentSortDirection?: number;
  @Input() currentlySortedField: string;

  constructor() {}

  ngOnInit(): void {}
}
