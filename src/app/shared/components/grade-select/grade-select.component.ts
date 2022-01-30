import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { GradingSystemsQuery } from 'src/generated/graphql';
import { GradingSystemsService } from '../../services/grading-systems.service';

@Component({
  selector: 'app-grade-select',
  templateUrl: './grade-select.component.html',
  styleUrls: ['./grade-select.component.scss'],
})
export class GradeSelectComponent implements OnInit, OnChanges {
  @Input() label: string;
  @Input() emptyText: string = 'Brez ocene';
  @Input() control: FormControl;
  @Input() gradingSystemId: string;
  @Input() noHint = false;

  allGrades: GradingSystemsQuery['gradingSystems'][0]['grades'];
  filteredGrades: GradingSystemsQuery['gradingSystems'][0]['grades'];
  gradeFilterControl: FormControl = new FormControl();

  onDestroySubject = new Subject<void>();

  constructor(private gradingSystemService: GradingSystemsService) {}

  ngOnInit(): void {
    this.init();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.gradingSystemId != null) {
      this.onDestroySubject.next();
      this.onDestroySubject.complete();

      this.init();
    }
  }

  init() {
    const gradingSystems = this.gradingSystemService.getGradingSystems();

    gradingSystems.then((gradingSystems) => {
      const gradingSystem = gradingSystems.find(
        (gradingSystem) => gradingSystem.id === this.gradingSystemId
      );

      if (gradingSystem == null) return;

      const grades = gradingSystem.grades;
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
