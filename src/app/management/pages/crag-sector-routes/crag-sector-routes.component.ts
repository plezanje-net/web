import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { filter, map, Subscription, switchMap, take, tap } from 'rxjs';
import {
  Crag,
  ManagementDeleteRouteGQL,
  ManagementGetSectorGQL,
  ManagementSaveRoutePositionsGQL,
  Route,
  Sector,
} from '../../../../generated/graphql';
import { LayoutService } from '../../../services/layout.service';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import {
  RouteFormComponent,
  RouteFormValues,
} from '../../forms/route-form/route-form.component';
import { CragAdminBreadcrumbs } from '../../utils/crag-admin-breadcrumbs';

interface TmpRoute {
  id: string;
  pos: number;
  newPos: number;
}

@Component({
  selector: 'app-crag-sector-routes',
  templateUrl: './crag-sector-routes.component.html',
  styleUrls: ['./crag-sector-routes.component.scss'],
})
export class CragSectorRoutesComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  savingPositions: boolean = false;
  heading: string = '';

  crag: Crag;
  sector: Sector;
  routes: Route[];

  subscriptions: Subscription[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private sectorGQL: ManagementGetSectorGQL,
    private savePositionsGQL: ManagementSaveRoutePositionsGQL,
    private deleteRouteGQL: ManagementDeleteRouteGQL,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    const sectorSub = this.activatedRoute.params
      .pipe(
        filter((params) => params.sector != null),
        switchMap(
          (params) =>
            this.sectorGQL.watch({
              id: params.sector,
            }).valueChanges
        )
      )
      .subscribe((result) => {
        this.loading = false;

        this.sector = <Sector>result.data.sector;
        this.crag = <Crag>this.sector.crag;

        this.routes = [...(<Route[]>result.data.sector.routes)];

        this.heading = `${this.crag.name}${
          this.sector.label || this.sector.name ? ', ' : ''
        }${this.sector.label}${
          this.sector.label && this.sector.name ? ' -' : ''
        } ${this.sector.name}`;

        this.layoutService.$breadcrumbs.next(
          new CragAdminBreadcrumbs(this.crag).build()
        );
      });

    this.subscriptions.push(sectorSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.routes, event.previousIndex, event.currentIndex);

    const data = this.routes
      .map(
        (route, index): TmpRoute => ({
          id: route.id,
          pos: route.position,
          newPos: index + 1,
        })
      )
      .filter((r) => r.pos != r.newPos)
      .map((r) => ({
        id: r.id,
        position: r.newPos,
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
          this.snackBar.open('Vrstni red smeri je bil shranjen', null, {
            duration: 2000,
          });
        });
      });
  }

  add(values: RouteFormValues = null): void {
    if (values == null) {
      values = { defaultGradingSystemId: this.crag.defaultGradingSystem.id };
    }
    this.dialog
      .open(RouteFormComponent, {
        data: {
          values: {
            ...values,
            position:
              this.routes.length == 0
                ? 1
                : this.routes[this.routes.length - 1].position + 1,
            sectorId: this.sector.id,
          },
        },
      })
      .afterClosed()
      .pipe(
        take(1),
        filter((values?: RouteFormValues) => values && values.addAnother)
      )
      .subscribe((values: RouteFormValues) => this.add(values));
  }

  edit(route: Route): void {
    this.dialog.open(RouteFormComponent, { data: { route: route } });
  }

  remove(sector: Sector): void {
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          title: 'Brisanje sektorja',
          message: 'Si prepričan, da želiš izbrisati to smer?',
        },
      })
      .afterClosed()
      .pipe(
        take(1),
        filter((value) => value != null),
        switchMap(() => this.deleteRouteGQL.mutate({ id: sector.id }))
      )
      .subscribe({
        next: () => {
          this.apollo.client.resetStore().then(() => {
            this.snackBar.open('Smer je bila izbrisana', null, {
              duration: 2000,
            });
          });
        },
        error: (error) => {
          this.snackBar.open(error.message, null, {
            panelClass: 'error',
            duration: 3000,
          });
        },
      });
  }
}
