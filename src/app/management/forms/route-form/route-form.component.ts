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
  routeTypeId?: string;
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

  gradingSystemOptions: GradingSystem[];

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

      this.gradingSystemsLoaded();
    });
  }

  gradingSystemsLoaded() {
    this.loadDifficultyOptions(this.form.value.defaultGradingSystemId);

    // grading system changes: load difficulty options for the chosen system
    const gradeSub =
      this.form.controls.defaultGradingSystemId.valueChanges.subscribe(
        (gradingSystemId) => this.loadDifficultyOptions(gradingSystemId)
      );
    this.subscriptions.push(gradeSub);

    // project changes: reset base difficulty if route is set as project
    const projectSub = this.form.controls.isProject.valueChanges
      .pipe(filter((value) => value == true))
      .subscribe(() => {
        this.form.patchValue({
          baseDifficulty: null,
        });
      });
    this.subscriptions.push(projectSub);

    // route type changes: unset length for boulders, filter grading systems and reset grading system if necessary
    const typeSub = this.form.controls.routeTypeId.valueChanges.subscribe(
      (value) => {
        if (value == 'boulder') {
          this.form.patchValue({
            length: null,
          });
        }

        this.gradingSystemOptions = this.gradingSystems.filter(
          (system) =>
            system.routeTypes.filter((type) => type.id == value).length > 0
        );

        if (
          this.gradingSystemOptions.find(
            (option) => option.id == this.form.value.defaultGradingSystemId
          ) == null
        ) {
          this.form.patchValue({
            defaultGradingSystemId: null,
          });
        }
      }
    );
    this.subscriptions.push(typeSub);

    // length changes: set to null if string is empty
    const lengthSub = this.form.controls.length.valueChanges
      .pipe(filter((value) => value == ''))
      .subscribe(() => this.form.patchValue({ length: null }));
    this.subscriptions.push(lengthSub);

    this.initializeFormData();
  }

  initializeFormData() {
    if (this.data.values) {
      if (
        this.data.values.defaultGradingSystemId != null &&
        this.data.values.routeTypeId == null
      ) {
        const gradingSystem = this.gradingSystems.find(
          (system) => system.id == this.data.values.defaultGradingSystemId
        );
        this.data.values.routeTypeId = gradingSystem?.routeTypes[0]?.id;
      }

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
