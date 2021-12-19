export const minGrade = -1100; // 1(a)
export const maxGrade = 1500; // 9c

export class Grade {
  public name: string;
  public legacyName: string;
  public modifier: number = 0;
  public number?: number;

  private gradeLetters = ['a', 'a+', 'b', 'b+', 'c', 'c+'];

  constructor(grade?: number) {
    if (grade != null) {
      this.parseGrade(grade);
      this.number = grade;

      this.parseLegacyGrade(grade);
    }
  }

  public parseGrade(grade: number): void {
    grade -= 600;
    const fullGradeNumber = (Math.round((grade / 100) * 2 - 0.1) / 2) * 100;
    const m = grade < -250 ? 12 : 14;
    const gradeNumber = Math.floor((fullGradeNumber / 100 + m) / 3);
    const baseNumber = (gradeNumber * 3 - 14) * 100;

    if (gradeNumber <= 3) {
      this.name = gradeNumber.toString();
      return;
    }

    const gradeLetter =
      this.gradeLetters[Math.round((fullGradeNumber - baseNumber) / 50)];

    const diff = grade - fullGradeNumber;

    this.name = gradeNumber + gradeLetter;

    if (gradeNumber < 6) {
      return;
    }

    if (diff >= 13) {
      this.modifier = 1;
    }

    if (diff <= -13) {
      this.modifier = -1;
    }
  }

  private parseLegacyGrade(grade: number): void {
    this.legacyName = this.name;

    if (grade % 25 == 0 && grade % 50 != 0) {
      const nextGrade = new Grade(grade + 25);
      this.legacyName += `/${nextGrade.name}`;
    }
  }
}
