import { Component, OnInit, Input } from '@angular/core';
import { Grade } from '../grade';

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.scss'],
})
export class GradeComponent implements OnInit {
  @Input() difficulty: number;
  @Input('system') gradingSystem: string;
  @Input('modifier') showModifier: boolean = false;
  @Input() legacy: boolean = false;

  grade: Grade;
  modifier: number = 0;

  gradeLetters = ['a', 'a+', 'b', 'b+', 'c', 'c+'];

  constructor() {}

  ngOnInit(): void {
    this.grade = new Grade(this.difficulty);
  }
}
