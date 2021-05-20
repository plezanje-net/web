import { Component, OnInit, Input } from '@angular/core';
import { Grade } from '../grade';

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.scss'],
})
export class GradeComponent implements OnInit {
  @Input('grade') numericGrade: number;
  @Input('text') alternativeText: string = '';
  @Input() showModifier: boolean = false;

  grade: Grade;
  modifier: number = 0;

  gradeLetters = ['a', 'a+', 'b', 'b+', 'c', 'c+'];

  constructor() {}

  ngOnInit(): void {
    this.grade = new Grade(this.numericGrade);

    if (this.numericGrade == null) {
      this.grade.name = this.alternativeText;
    }
  }
}
