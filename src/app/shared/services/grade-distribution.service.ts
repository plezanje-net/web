import { Injectable } from '@angular/core';
import { IDistribution } from 'src/app/common/distribution-chart/distribution-chart.component';
import { GradingSystemsService } from './grading-systems.service';

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

    const gradesDistribution: IDistribution[] = [];

    Object.entries(difficultyCounts).forEach(
      async ([grade, count]: [string, number]) => {
        const label = await this.gradingSystemsService.diffToGrade(
          Number(grade),
          gradingSystemId,
          true
        );

        gradesDistribution.push({
          label: label.name,
          value: count,
        });
      }
    );

    return gradesDistribution;
  }
}
