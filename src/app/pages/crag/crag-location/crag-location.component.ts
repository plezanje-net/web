import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Crag } from 'src/generated/graphql';
import { IDistribution } from '../../../common/distribution-chart/distribution-chart.component';

@Component({
  selector: 'app-crag-location',
  templateUrl: './crag-location.component.html',
  styleUrls: ['./crag-location.component.scss'],
})
export class CragLocationComponent implements OnInit {
  @Input() crag: Crag;

  @Input() id: string = 'default';

  attendanceDistribution: IDistribution[] = [];

  crags$ = new BehaviorSubject<any>([]);

  constructor() {}

  ngOnInit(): void {
    this.crags$.next([this.crag]);

    const months = [
      'Januar',
      'Februar',
      'Marec',
      'April',
      'Maj',
      'Junij',
      'Julij',
      'Avgust',
      'September',
      'Oktober',
      'November',
      'December',
    ];

    this.attendanceDistribution = this.crag.activityByMonth.map((value, m) => ({
      label: months[m],
      value: value,
    }));
  }
}
