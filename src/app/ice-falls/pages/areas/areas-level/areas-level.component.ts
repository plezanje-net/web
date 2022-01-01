import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Area, Country } from '../../../../../generated/graphql';

@Component({
  selector: 'app-areas-level',
  templateUrl: './areas-level.component.html',
  styleUrls: ['./areas-level.component.scss'],
})
export class AreasLevelComponent implements OnInit, OnChanges {
  @Input() level: number = 0;
  @Input() areas: Area[];
  @Input() country: Country;

  filteredAreas: Area[];

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.areas != null) {
      this.filteredAreas = this.areas
        .filter((a) => this.hasDeepIceFalls(<Area>a))
        .map((a) => ({
          ...a,
          areas:
            a.areas != null
              ? a.areas.filter((a2) => this.hasDeepIceFalls(<Area>a2))
              : [],
        }));
    }
  }

  hasDeepIceFalls(area: Area): boolean {
    if (area.iceFalls.length > 0) {
      return true;
    }

    if (area.areas == undefined || area.areas.length == 0) {
      return false;
    }

    let f = false;

    area.areas.forEach((a) => {
      if (this.hasDeepIceFalls(a)) {
        f = true;
        return;
      }
    });

    return f;
  }
}
