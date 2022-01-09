import { Component, OnInit, Input } from '@angular/core';
import { Grade } from '../../../common/grade';
import { IDistribution } from '../../../common/distribution-chart/distribution-chart.component';
import { getGradeDistribution } from 'src/app/common/grade-distribution';

@Component({
  selector: 'app-route-info',
  templateUrl: './route-info.component.html',
  styleUrls: ['./route-info.component.scss'],
})
export class RouteInfoComponent implements OnInit {
  @Input() route: any;
  grades: any[];
  gradesDistribution: IDistribution[] = [];
  author: string;
  firstAscent: string;

  constructor() {}

  ngOnInit(): void {
    if (this.route) {
      this.grades = this.route.difficultyVotes.slice();
      this.grades.sort((a, b) => a.grade - b.grade);

      this.gradesDistribution = getGradeDistribution(this.grades);

      if (this.route.author) {
        if (this.route.author.indexOf('/') > -1) {
          this.author = this.route.author.split('/')[0];
          this.firstAscent = this.route.author.split('/')[1];
        } else {
          this.author = this.route.author;
        }
      }
    }
  }
}
