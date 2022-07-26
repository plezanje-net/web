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
  @Input() focusDifficulty = null;

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

  /**
   * When select is opened, scroll to the grade that might be passed in as a focus difficulty - that is the route's current grade for example
   */
  onOpened() {
    if (!this.focusDifficulty) return; // e.g. if project, there is no focus difficulty

    if (this.control.value) return;

    this.gradingSystemService
      .diffToGrade(this.focusDifficulty, this.gradingSystemId, false)
      .then((grade) => {
        const allOptions = document.querySelectorAll('mat-option');
        for (let i = 0; i < allOptions.length; i++) {
          const goBack = Math.min(i, 3); // deduct 3 to get the target in the center (5 are displayed)
          if ((<HTMLElement>allOptions[i]).innerText === grade.name) {
            allOptions[i - goBack].scrollIntoView();
            break;
          }
        }
      });
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
