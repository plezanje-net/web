import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { combineLatest, filter, Subscription, switchMap, take } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { LayoutService } from 'src/app/services/layout.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import {
  Area,
  Country,
  CountryAreasGQL,
  ManagementDeleteAreaGQL,
} from 'src/generated/graphql';
import { AreaFormComponent } from '../../forms/area-form/area-form.component';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss'],
})
export class AreasComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  country: Country;
  loading = true;
  heading: string;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private countryAreasGQL: CountryAreasGQL,
    private deleteAreaGQL: ManagementDeleteAreaGQL,
    private layoutService: LayoutService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    const sub = combineLatest([
      this.activatedRoute.params.pipe(
        filter((params) => params.country != null),
        switchMap(
          ({ country }) =>
            this.countryAreasGQL.watch({
              country: country,
            }).valueChanges
        )
      ),
      this.authService.currentUser.asObservable(),
    ]).subscribe(([result, user]) => {
      this.loading = false;

      this.country = result.data.countryBySlug as Country;

      this.heading = `${this.country.name}`;
      this.layoutService.$breadcrumbs.next([]);
    });

    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  totals({ areas, crags, iceFalls, peaks }: Area): string {
    return [
      ['Področja', areas.length],
      ['Plezališča', crags.length],
      ['Slapovi', iceFalls.length],
      ['Vrhovi', peaks.length],
    ]
      .filter(([_, len]) => len > 0)
      .map(([label, len]) => `${label}: ${len}`)
      .join(', ');
  }

  hasDescendants({ areas, crags, iceFalls, peaks }: Area): boolean {
    return (
      !!areas.length || !!crags.length || !!iceFalls.length || !!peaks.length
    );
  }

  add(): void {
    this.dialog.open(AreaFormComponent, {
      data: {
        countryId: this.country.id,
      },
    });
  }

  edit(area: Area): void {
    this.dialog.open(AreaFormComponent, {
      data: { area: area, countryId: this.country.id },
    });
  }

  remove(area: Area): void {
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          title: 'Brisanje področja',
          message: 'Si prepričan_a, da želiš izbrisati to področje?',
        },
      })
      .afterClosed()
      .pipe(
        take(1),
        filter((value) => value != null),
        switchMap(() => this.deleteAreaGQL.mutate({ id: area.id }))
      )
      .subscribe({
        next: () =>
          this.apollo.client.resetStore().then(() => {
            this.snackBar.open('Področje je bil izbrisano', null, {
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
