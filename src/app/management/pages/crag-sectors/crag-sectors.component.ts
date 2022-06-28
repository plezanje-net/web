import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { combineLatest, filter, Subscription, switchMap, take } from 'rxjs';
import {
  Crag,
  ManagementDeleteSectorGQL,
  ManagementGetCragSectorsGQL,
  ManagementSaveSectorPositionGQL,
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
import { AuthService } from 'src/app/auth/auth.service';
import { User } from '@sentry/angular';

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

  user: User;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private sectorsGQL: ManagementGetCragSectorsGQL,
    private savePositionGQL: ManagementSaveSectorPositionGQL,
    private deleteSectorGQL: ManagementDeleteSectorGQL,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.activatedRoute.params.pipe(
        filter((params) => params.crag != null),
        switchMap(
          ({ crag }) =>
            this.sectorsGQL.watch({
              id: crag,
            }).valueChanges
        )
      ),
      this.authService.currentUser.asObservable(),
    ]).subscribe(([result, user]) => {
      this.loading = false;

      this.crag = <Crag>result.data.crag;

      this.user = user;

      this.heading = `${this.crag.name}`;
      this.layoutService.$breadcrumbs.next(
        new CragAdminBreadcrumbs(this.crag).build()
      );

      this.sectors = [...(<Sector[]>result.data.crag.sectors)];
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousIndex == event.currentIndex) return;

    const data = {
      id: this.sectors[event.previousIndex].id,
      position:
        event.currentIndex > event.previousIndex
          ? this.sectors[event.currentIndex].position + 1
          : this.sectors[event.currentIndex].position,
    };

    // move in FE to see changes even before BE responds
    moveItemInArray(this.sectors, event.previousIndex, event.currentIndex);

    this.savingPositions = true;

    this.savePositionGQL
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

  canEdit(sector: Sector): boolean {
    return (
      this.user.roles.includes('admin') || sector.publishStatus != 'published'
    );
  }

  add(): void {
    this.dialog.open(SectorFormComponent, {
      data: {
        position:
          this.sectors.length == 0
            ? 1
            : this.sectors[this.sectors.length - 1].position + 1,
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
      .subscribe({
        next: () =>
          this.apollo.client.resetStore().then(() => {
            this.snackBar.open('Sektor je bil izbrisan', null, {
              duration: 2000,
            });
          }),
        error: (error) => {
          this.snackBar.open(error.message, null, {
            panelClass: 'error',
            duration: 3000,
          });
        },
      });
  }
}
