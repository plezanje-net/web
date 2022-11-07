import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IDistribution } from '../../../common/distribution-chart/distribution-chart.component';
import { GradeDistributionService } from 'src/app/shared/services/grade-distribution.service';
import { Route, User } from 'src/generated/graphql';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-route-info',
  templateUrl: './route-info.component.html',
  styleUrls: ['./route-info.component.scss'],
})
export class RouteInfoComponent implements OnInit, OnDestroy {
  @Input() route: Route;
  grades: any[];
  hideGrade = false;
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

  user: User;
  subscriptions = [];

  constructor(
    private gradeDistributionService: GradeDistributionService,
    private authService: AuthService
  ) {}

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

    this.hideGrade =
      this.route.properties.find(
        (property) => property.propertyType.id == 'extGrade'
      ) != null;

    const userSub = this.authService.currentUser.subscribe(
      (user) => (this.user = user)
    );
    this.subscriptions.push(userSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
