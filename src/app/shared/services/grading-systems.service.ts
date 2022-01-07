import { Injectable } from '@angular/core';
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
        const result = await this.GradingSystemsGQL.fetch().toPromise();
        this.gradingSystems = result.data.gradingSystems;
        resolve(this.gradingSystems);
      } else {
        resolve(this.gradingSystems);
      }
    });
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
          if (legacy) {
            grades.forEach((grade) => {
              if (grade.difficulty === difficulty) {
                resolve({
                  name: grade.name,
                  modifier: 0,
                });
              }
            });
          } else {
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
          }
        })
        .catch(() => {
          reject();
        });
    });
  }
}
