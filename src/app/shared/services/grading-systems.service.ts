import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { GradingSystemsGQL, GradingSystemsQuery } from 'src/generated/graphql';

export interface IGrade {
  name: string;
  modifier: -1 | 0 | 1; // -1 means the grade is soft, +1 means it's hard
}

@Injectable({
  providedIn: 'root',
})
export class GradingSystemsService {
  gradingSystems: GradingSystemsQuery['gradingSystems'];

  constructor(private GradingSystemsGQL: GradingSystemsGQL) {}

  getGradingSystems(): Promise<GradingSystemsQuery['gradingSystems']> {
    // TODO save the promise to prevent multiple requests
    return new Promise(async (resolve) => {
      if (!this.gradingSystems) {
        const result = await lastValueFrom(this.GradingSystemsGQL.fetch());
        this.gradingSystems = result.data.gradingSystems;
        resolve(this.gradingSystems);
      } else {
        resolve(this.gradingSystems);
      }
    });
  }

  parseLegacyFrenchInBetweenName(lowName: string, highName: string) {
    // this would break when 10a is climbed, but since we do not allow legacy style votes, no such grade will ever be displayed in legacy mode
    const lowNum = lowName.charAt(0);
    const highNum = highName.charAt(0);
    if (lowNum === highNum) {
      return lowName + '/' + highName.substring(1);
    } else {
      return lowName + '/' + highName;
    }
  }
  // TODO: should maybe implement> getGradingSystem('french') or getGradingSystemGrades('french')

  diffToGrade(
    difficulty: number,
    gradingSystemId: string,
    legacy: boolean = false
  ): Promise<IGrade> {
    return new Promise((resolve, reject) => {
      this.getGradingSystems()
        .then((gradingSystems) => {
          const grades = gradingSystems.find(
            (gradingSystem) => gradingSystem.id === gradingSystemId
          ).grades;
          // legacy grades should always be accurate and can only be found as grade suggestions
          // for example in the case of french grades, legacy grades should always have remainder 0 when dividing by 25
          // only french grades can be displayed in legacy mode.
          // TODO: how to display nonlegacy votes that fall inbetween because of different grading system (voted in one system, display in another system). should discuss...
          if (legacy && gradingSystemId === 'french') {
            for (let i = 1; i < grades.length; i++) {
              const prev = grades[i - 1];
              const curr = grades[i];
              if ((prev.difficulty + curr.difficulty) / 2 === difficulty) {
                return resolve({
                  name: this.parseLegacyFrenchInBetweenName(
                    prev.name,
                    curr.name
                  ),
                  modifier: 0,
                });
              }
            }
          }
          // if lowest possible or highest possible grade, simply resolve without modifiers
          if (difficulty <= grades[0].difficulty) {
            return resolve({
              name: grades[0].name,
              modifier: 0,
            });
          } else if (difficulty >= grades[grades.length - 1].difficulty) {
            return resolve({
              name: grades[grades.length - 1].name,
              modifier: 0,
            });
          }

          // skip checks for lowest and highest possible grade
          for (let i = 1; i < grades.length - 1; i++) {
            const prev = grades[i - 1];
            const curr = grades[i];
            const next = grades[i + 1];

            // loop until curr is the closest grade to the searched grade
            if (
              Math.abs(curr.difficulty - difficulty) <=
              Math.abs(next.difficulty - difficulty)
            ) {
              if (difficulty < curr.difficulty) {
                const gradesMiddlemark =
                  (curr.difficulty + prev.difficulty) / 2;

                if (
                  Math.abs(curr.difficulty - difficulty) <
                  Math.abs(gradesMiddlemark - difficulty)
                ) {
                  return resolve({
                    name: curr.name,
                    modifier: 0,
                  });
                } else {
                  return resolve({
                    name: curr.name,
                    modifier: -1,
                  });
                }
              } else if (difficulty > curr.difficulty) {
                const gradesMiddlemark =
                  (curr.difficulty + next.difficulty) / 2;

                if (
                  Math.abs(curr.difficulty - difficulty) <=
                  Math.abs(gradesMiddlemark - difficulty)
                ) {
                  return resolve({
                    name: curr.name,
                    modifier: 0,
                  });
                } else {
                  return resolve({
                    name: curr.name,
                    modifier: +1,
                  });
                }
              } else {
                return resolve({
                  name: curr.name,
                  modifier: 0,
                });
              }
            }
          }
        })
        .catch(() => {
          reject();
        });
    });
  }
}
