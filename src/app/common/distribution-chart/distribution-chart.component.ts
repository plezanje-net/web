import { Component, OnInit, Input } from '@angular/core';

export interface IDistribution {
  label: string;
  value: number;
}

@Component({
  selector: 'app-distribution-chart',
  templateUrl: './distribution-chart.component.html',
  styleUrls: ['./distribution-chart.component.scss']
})
export class DistributionChartComponent implements OnInit {

  @Input() distribution: IDistribution[] = [];
  maxValue: number;

  constructor() {}

  ngOnInit(): void {
    if (!this.distribution) {
      return;
    }

    let maxValue: number = 0;

    this.distribution.forEach(element => {
      if (element.value > maxValue) {
        maxValue = element.value;
      }
    });

    this.maxValue = maxValue;
  }
}
