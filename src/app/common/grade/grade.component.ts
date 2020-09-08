import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.scss']
})
export class GradeComponent implements OnInit {

  @Input('grade') numericGrade: number;
  @Input('text') alternativeText: string = '';
  @Input() showModifier: boolean = false;

  grade: string;
  modifier: number = 0;

  gradeLetters = ['a', 'a+', 'b', 'b+', 'c', 'c+'];


  constructor() { }

  ngOnInit(): void {
    this.grade = this.getGradeString()
  }

  getGradeString(): string {
    if (this.numericGrade == null) {
      return this.alternativeText;
    }

    let gradeNumber = Math.floor((this.numericGrade / 100 + 14) / 3);

    let baseNumber = (gradeNumber * 3 - 14) * 100;

    if (gradeNumber <= 3) {
      return gradeNumber.toString();
    }

    let gradeLetter = this.gradeLetters[Math.floor((this.numericGrade - baseNumber) / 50)];

    return gradeNumber + gradeLetter;
  }

}
