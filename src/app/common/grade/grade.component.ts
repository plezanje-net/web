import { Component, OnInit, Input } from '@angular/core';
// import { Grade } from '../grade';
import { GradingSystemsService, IGrade } from '../../shared/services/grading-systems.service'

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

  // grade: Grade;
  grade: IGrade;
  modifier: number = 0;

  gradeLetters = ['a', 'a+', 'b', 'b+', 'c', 'c+'];

  constructor(private GradingSystemsService: GradingSystemsService) {}

  ngOnInit(): void {
    // this.grade = new Grade(this.difficulty);
    this.GradingSystemsService.diffToGrade(this.difficulty, 'french', this.legacy).then((name) => {
      this.grade = name;
      // console.log({ ...name, diff: this.difficulty});
    });
  }
}
