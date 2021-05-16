import { Component, OnInit, Input } from '@angular/core';
import { Grade } from '../../../common/grade';
import { IDistribution } from '../../../common/distribution-chart/distribution-chart.component';

@Component({
  selector: 'app-route-info',
  templateUrl: './route-info.component.html',
  styleUrls: ['./route-info.component.scss']
})
export class RouteInfoComponent implements OnInit {

  @Input() route: any;
  grades: any[];
  gradesDistribution: IDistribution[] = [];

  constructor() {}

  ngOnInit(): void {
    if (this.route) {
      this.grades = this.route.grades.slice();
      this.grades.sort((a, b) => a.grade - b.grade);

      // this.gradesDisribution.findIndex((distribution) => distribution.label === grade.grade) > -1
      const dist = {};
      this.grades.forEach((grade) => {
        if (dist[grade.grade]) {
          dist[grade.grade]++;
        } else {
          dist[grade.grade] = 1;
        }
      });

      Object.entries(dist).forEach(([grade, count]: [string, number]) => {
        this.gradesDistribution.push({
          label: new Grade(Number(grade)).name,
          value: count,
        });
      });
    }
  }
}
