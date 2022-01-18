import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Apollo } from 'apollo-angular';
import { filter, Subscription } from 'rxjs';
import { Registry } from 'src/app/types/registry';
import {
  Grade,
  GradingSystem,
  ManagementCreateRouteGQL,
  ManagementUpdateRouteGQL,
  Route,
} from 'src/generated/graphql';
import { GradingSystemsService } from '../../../shared/services/grading-systems.service';

export interface RouteFormComponentData {
  route?: Route;
  values?: RouteFormValues;
}

export interface RouteFormValues {
  position?: number;
  sectorId?: string;
  defaultGradingSystemId?: string;
  addAnother?: boolean;
}

const RouteFormValidator: ValidatorFn = (fg: FormGroup) => {
  const id = fg.get('id').value;
  const isProject = fg.get('isProject').value;
  const baseDifficulty = fg.get('baseDifficulty').value;
  return id == null && !isProject && baseDifficulty == null
    ? { baseDifficultyRequired: true }
    : null;
};

@Component({
  selector: 'app-route-form',
  templateUrl: './route-form.component.html',
  styleUrls: ['./route-form.component.scss'],
})
export class RouteFormComponent implements OnInit, OnDestroy {
  saving = false;

  editing = false;

  form = new FormGroup(
    {
      id: new FormControl(),
      name: new FormControl(null, Validators.required),
      routeTypeId: new FormControl('sport', Validators.required),
      length: new FormControl(),
      defaultGradingSystemId: new FormControl('french', Validators.required),
      isProject: new FormControl(false),
      baseDifficulty: new FormControl(null),
      position: new FormControl(),
      sectorId: new FormControl(),
      addAnother: new FormControl(false),
    },
    {
      validators: [RouteFormValidator],
    }
  );

  gradingSystems: GradingSystem[];

  typeOptions: Registry[] = [
    { value: 'sport', label: 'Športna' },
    { value: 'multipitch', label: 'Večraztežajna' },
    { value: 'boulder', label: 'Balvan' },
    { value: 'alpine', label: 'Alpinistična' },
    { value: 'combined', label: 'Kombinirana' },
  ];

  difficultyOptions: Grade[] = [];

  subscriptions: Subscription[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: RouteFormComponentData,
    private dialogRef: MatDialogRef<RouteFormComponent>,
    private gradingSystemsService: GradingSystemsService,
    private createGQL: ManagementCreateRouteGQL,
    private updateGQL: ManagementUpdateRouteGQL,
    private apollo: Apollo,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.gradingSystemsService.getGradingSystems().then((gradingSystems) => {
      this.gradingSystems = <GradingSystem[]>gradingSystems;

      this.loadDifficultyOptions(this.form.value.defaultGradingSystemId);

      const gradeSub =
        this.form.controls.defaultGradingSystemId.valueChanges.subscribe(
          (gradingSystemId) => this.loadDifficultyOptions(gradingSystemId)
        );
      this.subscriptions.push(gradeSub);
    });

    const projectSub = this.form.controls.isProject.valueChanges
      .pipe(filter((value) => value == true))
      .subscribe(() => {
        this.form.patchValue({
          baseDifficulty: null,
        });
      });
    this.subscriptions.push(projectSub);

    const typeSub = this.form.controls.routeTypeId.valueChanges
      .pipe(filter((value) => value == 'boulder'))
      .subscribe(() => {
        this.form.patchValue({
          length: null,
        });
      });
    this.subscriptions.push(typeSub);

    if (this.data.values) {
      this.form.patchValue(this.data.values);
    }

    if (this.data.route) {
      this.editing = true;
      this.form.patchValue({
        ...this.data.route,
        defaultGradingSystemId: this.data.route.defaultGradingSystem.id,
        routeTypeId: this.data.route.routeType.id,
      });
    }
  }

  loadDifficultyOptions(gradingSystemId: string) {
    const gradingSystem = this.gradingSystems.find(
      (gradingSystem) => gradingSystem.id == gradingSystemId
    );
    this.difficultyOptions = gradingSystem ? gradingSystem.grades : [];
  }

  save() {
    this.saving = true;

    const value = this.form.value;

    const success = () => {
      this.apollo.client.resetStore().then(() => {
        this.saving = false;

        const { routeTypeId, defaultGradingSystemId } = value;

        this.dialogRef.close(
          value.addAnother
            ? {
                addAnother: true,
                routeTypeId,
                defaultGradingSystemId,
              }
            : null
        );
      });
    };
    const error = () => {
      this.snackbar.open('Pri shranjevanju je prišlo do napake', null, {
        panelClass: 'error',
        duration: 3000,
      });
    };

    if (this.data.route != null) {
      this.updateGQL
        .mutate({
          input: {
            id: value.id,
            name: value.name,
            length: value.length,
            routeTypeId: value.routeTypeId,
            defaultGradingSystemId: value.defaultGradingSystemId,
          },
        })
        .subscribe({
          next: success,
          error: error,
        });
    } else {
      this.createGQL
        .mutate({
          input: {
            name: value.name,
            length: value.length,
            isProject: value.isProject,
            routeTypeId: value.routeTypeId,
            baseDifficulty: value.baseDifficulty,
            defaultGradingSystemId: value.defaultGradingSystemId,
            position: this.data.values.position,
            sectorId: this.data.values.sectorId,
            status: 'public',
          },
        })
        .subscribe({
          next: success,
          error: error,
        });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
