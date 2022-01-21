import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { subscribe } from 'graphql';
import { filter, Subject, Subscription, switchMap, take } from 'rxjs';
import { SnackBarButtonsComponent } from 'src/app/shared/snack-bar-buttons/snack-bar-buttons.component';
import {
  Crag,
  ManagementDeleteSectorGQL,
  ManagementGetCragSectorsGQL,
  ManagementSaveSectorPositionsGQL,
  Route,
  Sector,
} from 'src/generated/graphql';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';
import { LayoutService } from '../../../services/layout.service';
import { CragAdminBreadcrumbs } from '../../utils/crag-admin-breadcrumbs';
import { MatDialog } from '@angular/material/dialog';
import { SectorFormComponent } from '../../forms/sector-form/sector-form.component';
import { Apollo } from 'apollo-angular';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

interface TmpSector {
  id: string;
  pos: number;
  newPos: number;
}

@Component({
  selector: 'app-crag-sectors',
  templateUrl: './crag-sectors.component.html',
  styleUrls: ['./crag-sectors.component.scss'],
})
export class CragSectorsComponent implements OnInit {
  loading: boolean = true;
  savingPositions: boolean = false;
  heading: string = '';

  crag: Crag;
  sectors: Sector[];

  subscriptions: Subscription[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private sectorsGQL: ManagementGetCragSectorsGQL,
    private savePositionsGQL: ManagementSaveSectorPositionsGQL,
    private deleteSectorGQL: ManagementDeleteSectorGQL,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        filter((params) => params.crag != null),
        switchMap(
          ({ crag }) =>
            this.sectorsGQL.watch({
              id: crag,
            }).valueChanges
        )
      )
      .subscribe((result) => {
        this.loading = false;

        this.crag = <Crag>result.data.crag;

        this.heading = `${this.crag.name}`;
        this.layoutService.$breadcrumbs.next(
          new CragAdminBreadcrumbs(this.crag).build()
        );

        this.sectors = [...(<Sector[]>result.data.crag.sectors)];
      });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.sectors, event.previousIndex, event.currentIndex);

    const data = this.sectors
      .map(
        (sector, index): TmpSector => ({
          id: sector.id,
          pos: sector.position,
          newPos: index + 1,
        })
      )
      .filter((s) => s.pos != s.newPos)
      .map((s) => ({
        id: s.id,
        position: s.newPos,
      }));

    if (data.length == 0) {
      return;
    }

    this.savingPositions = true;

    this.savePositionsGQL
      .mutate({ input: data }, { fetchPolicy: 'no-cache' })
      .subscribe(() => {
        this.apollo.client.resetStore().then(() => {
          this.savingPositions = false;
          this.snackBar.open('Vrstni red sektorjev je bil shranjen', null, {
            duration: 2000,
          });
        });
      });
  }

  add(): void {
    this.dialog.open(SectorFormComponent, {
      data: {
        position: this.sectors[this.sectors.length - 1].position + 1,
        cragId: this.crag.id,
      },
    });
  }

  edit(sector: Sector): void {
    this.dialog.open(SectorFormComponent, { data: { sector: sector } });
  }

  remove(sector: Sector): void {
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          title: 'Brisanje sektorja',
          message:
            'Si prepričan, da želiš izbrisati ta sektor in vse njegove smeri?',
        },
      })
      .afterClosed()
      .pipe(
        take(1),
        filter((value) => value != null),
        switchMap(() => this.deleteSectorGQL.mutate({ id: sector.id }))
      )
      .subscribe(() => {
        this.apollo.client.resetStore().then(() => {
          this.snackBar.open('Sektor je bil izbrisan', null, {
            duration: 2000,
          });
        });
      });
  }
}
