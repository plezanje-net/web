import { IDistribution } from "./distribution-chart/distribution-chart.component";
import { Grade } from "./grade";

export function getGradeDistribution(difficultyVotes): IDistribution[] {
  const difficultyCounts = {};

  difficultyVotes.forEach((vote) => {
    if (difficultyCounts[vote.difficulty]) {
      difficultyCounts[vote.difficulty]++;
    } else {
      difficultyCounts[vote.difficulty] = 1;
    }
  });

  const gradesDistribution: IDistribution[] = [];

  Object.entries(difficultyCounts).forEach(([grade, count]: [string, number]) => {
    gradesDistribution.push({
      label: new Grade(Number(grade)).legacyName,
      value: count,
    });
  });

  return gradesDistribution;
}
