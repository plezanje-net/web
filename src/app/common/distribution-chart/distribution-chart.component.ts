import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';

export interface IDistribution {
  label: string;
  value: number;
}

@Component({
  selector: 'app-distribution-chart',
  templateUrl: './distribution-chart.component.html',
  styleUrls: ['./distribution-chart.component.scss'],
})
export class DistributionChartComponent implements OnChanges, AfterViewInit {
  @Input() distribution: IDistribution[] = [];
  @Output() onViewInit = new EventEmitter<void>();

  maxValue: number;

  constructor() {}

  ngOnChanges(): void {
    if (!this.distribution) {
      return;
    }

    let maxValue: number = 0;

    this.distribution.forEach((element) => {
      if (element.value > maxValue) {
        maxValue = element.value;
      }
    });

    this.maxValue = maxValue;
  }

  ngAfterViewInit(): void {
    // this is used when this component is a child of CragRoutePreviewComponent which measures the height after view init
    this.onViewInit.emit();
  }
}
