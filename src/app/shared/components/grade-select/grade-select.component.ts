import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { GradingSystemsQuery } from 'src/generated/graphql';
import { GradingSystemsService } from '../../services/grading-systems.service';

@Component({
  selector: 'app-grade-select',
  templateUrl: './grade-select.component.html',
  styleUrls: ['./grade-select.component.scss'],
})
export class GradeSelectComponent implements OnInit {
  @Input() label: string;
  @Input() control: FormControl;
  @Input() gradingSystemId: string;

  allGrades: GradingSystemsQuery['gradingSystems'][0]['grades'];
  filteredGrades: GradingSystemsQuery['gradingSystems'][0]['grades'];
  gradeFilterControl: FormControl = new FormControl();

  onDestroySubject = new Subject<void>();

  constructor(private gradingSystemService: GradingSystemsService) {}

  ngOnInit(): void {
    const gradingSystems = this.gradingSystemService.getGradingSystems();

    gradingSystems.then((gradingSystems) => {
      console.log(gradingSystems);
      const grades = gradingSystems.find(
        (gradingSystem) => gradingSystem.id === this.gradingSystemId
      ).grades;
      this.allGrades = grades;

      this.populateGradesDropdown();

      this.gradeFilterControl.valueChanges
        .pipe(takeUntil(this.onDestroySubject))
        .subscribe(() => {
          this.populateGradesDropdown();
        });
    });
  }

  populateGradesDropdown() {
    let search: string = this.gradeFilterControl.value;
    if (search) {
      search = search.toLowerCase();
      this.filteredGrades = this.allGrades.filter(
        (grade) => grade.name.indexOf(search) > -1
      );
    } else {
      this.filteredGrades = this.allGrades;
    }
  }

  ngOnDestroy(): void {
    this.onDestroySubject.next();
    this.onDestroySubject.complete();
  }
}
