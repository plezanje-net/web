import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Grade, maxGrade, minGrade } from 'src/app/common/grade';

@Component({
  selector: 'app-grade-select',
  templateUrl: './grade-select.component.html',
  styleUrls: ['./grade-select.component.scss'],
})
export class GradeSelectComponent implements OnInit, OnDestroy {
  @Input() label: string;
  @Input() control: FormControl;

  allGrades: Grade[] = [];

  filteredGradesOptions: ReplaySubject<Grade[]> = new ReplaySubject<Grade[]>(1);
  gradeFilterControl: FormControl = new FormControl();

  onDestroySubject = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
    let current = minGrade;

    while (current <= maxGrade) {
      this.allGrades.push(new Grade(current));
      current += current >= -200 ? 50 : 300;
    }

    this.populateGradesDropdown();

    this.gradeFilterControl.valueChanges
      .pipe(takeUntil(this.onDestroySubject))
      .subscribe(() => {
        this.populateGradesDropdown();
      });
  }

  ngOnDestroy(): void {
    this.onDestroySubject.next();
    this.onDestroySubject.complete();
  }

  populateGradesDropdown(): void {
    let search: string = this.gradeFilterControl.value;

    const grades = this.allGrades;

    if (search) {
      search = search.toLowerCase();

      this.filteredGradesOptions.next(
        grades.filter((grade) => grade.name.indexOf(search) > -1)
      );
    } else {
      this.filteredGradesOptions.next(grades.slice());
    }
  }
}
