import { Injectable } from '@angular/core';
import { IDistribution } from 'src/app/common/distribution-chart/distribution-chart.component';
import { GradingSystemsService, IGrade } from './grading-systems.service';

@Injectable({
  providedIn: 'root',
})
export class GradeDistributionService {
  constructor(private gradingSystemsService: GradingSystemsService) {}

  async getDistribution(
    difficultyVotes: { difficulty: number }[],
    gradingSystemId: string
  ): Promise<IDistribution[]> {
    const difficultyCounts: Record<number, number> = {};

    difficultyVotes.forEach((vote) => {
      if (difficultyCounts[vote.difficulty]) {
        difficultyCounts[vote.difficulty]++;
      } else {
        difficultyCounts[vote.difficulty] = 1;
      }
    });

    return new Promise((resolve) => {
      const diffToGradePromises: Promise<IGrade>[] = [];

      Object.keys(difficultyCounts).forEach((grade: string): void => {
        diffToGradePromises.push(
          this.gradingSystemsService.diffToGrade(
            Number(grade),
            gradingSystemId,
            true
          )
        );
      });

      Promise.all(diffToGradePromises).then((distributions) => {
        const gradesDistribution: IDistribution[] = distributions.map(
          (distribution, i) => ({
            label: distribution.name,
            value: Object.values(difficultyCounts)[i],
          })
        );

        resolve(gradesDistribution);
      });
    });
  }
}
