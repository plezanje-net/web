import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { subscribe } from 'graphql';
import { Subject } from 'rxjs';
import { SnackBarButtonsComponent } from 'src/app/shared/snack-bar-buttons/snack-bar-buttons.component';
import { Crag, Route, Sector } from 'src/generated/graphql';

export interface SectorAction {
  action: string;
  sectorIndex?: number;
  routeIndex?: number;
}

@Component({
  selector: 'app-crag-sectors',
  templateUrl: './crag-sectors.component.html',
  styleUrls: ['./crag-sectors.component.scss'],
})
export class CragSectorsComponent implements OnInit {
  @Input() crag: Crag;

  form = new FormArray([]);
  action$ = new Subject<SectorAction>();

  submitButton?: MatSnackBarRef<SnackBarButtonsComponent>;

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    if (this.crag != null) {
      this.crag.sectors.forEach((sector) => {
        this.addSector(sector);
      });
    }

    this.form.valueChanges.subscribe(() => this.formChanges());
  }

  formChanges(): void {
    if (!this.submitButton) {
      this.submitButton = this.snackBar.openFromComponent(
        SnackBarButtonsComponent,
        {
          horizontalPosition: 'end',
          data: {
            buttons: [
              {
                label: `Shrani spremembe`,
              },
            ],
          },
        }
      );

      this.submitButton.onAction().subscribe(() => {
        console.log('saving');
        console.log(this.form.value);
      });

      this.submitButton
        .afterDismissed()
        .subscribe(() => (this.submitButton = null));
    }
  }

  addSector(data?: Sector) {
    const sector = new FormGroup({
      id: new FormControl(),
      label: new FormControl(),
      name: new FormControl(),
      status: new FormControl(),
      routes: new FormArray([]),
    });

    sector.patchValue(data ?? {});

    if (data != null) {
      data.routes.forEach((route) => this.addRoute(sector, route));
    }

    this.form.push(sector);
  }

  moveSector(sectorIndex: number, moveTo: number) {
    const sector = this.form.at(sectorIndex);

    this.form.removeAt(sectorIndex);
    this.form.insert(moveTo, sector);
  }

  deleteSector(index: number) {
    this.form.removeAt(index);
  }

  addRoute(sector: FormGroup, data?: Route) {
    const route = new FormGroup({
      id: new FormControl(),
      name: new FormControl(),
      grade: new FormControl(),
    });

    route.patchValue(data ?? {});

    (sector.controls.routes as FormArray).push(route);
  }

  moveRoute(sector: FormGroup, routeIndex: number, moveTo: number) {
    const routes = sector.controls.routes as FormArray;
    const route = routes.at(routeIndex);

    routes.removeAt(routeIndex);
    routes.insert(moveTo, route);
  }

  deleteRoute(sector: FormGroup, index: number) {
    const routes = sector.controls.routes as FormArray;
    routes.removeAt(index);
  }
}
