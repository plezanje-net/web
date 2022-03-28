import { Component, OnInit, Input } from '@angular/core';
import { IDistribution } from '../../../common/distribution-chart/distribution-chart.component';
import { GradeDistributionService } from 'src/app/shared/services/grade-distribution.service';
import { Route } from 'src/generated/graphql';

@Component({
  selector: 'app-route-info',
  templateUrl: './route-info.component.html',
  styleUrls: ['./route-info.component.scss'],
})
export class RouteInfoComponent implements OnInit {
  @Input() route: Route;
  grades: any[];
  gradesDistribution: IDistribution[] = [];

  eventTypeMap = {
    '1C': 'Prvi vzpon',
    '1F': 'Prva ženska ponovitev',
    '1W': 'Prva zimska ponovitev',
    '2C': 'Prva ponovitev',
    '2F': 'Prva prosta ponovitev',
    AU: 'Avtor_ica',
    BT: 'Opremil_a',
    RB: 'Preopremil_a',
  };

  constructor(private gradeDistributionService: GradeDistributionService) {}

  ngOnInit(): void {
    if (this.route) {
      this.grades = this.route.difficultyVotes.slice();
      this.grades.sort((a, b) => a.grade - b.grade);

      this.gradeDistributionService
        .getDistribution(this.grades, this.route.defaultGradingSystem.id)
        .then((dist: IDistribution[]) => {
          this.gradesDistribution = dist;
        });
    }
  }
}
