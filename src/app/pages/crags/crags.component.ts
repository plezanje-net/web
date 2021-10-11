import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/services/layout.service';
import { DataError } from '../../types/data-error';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CragFormComponent } from 'src/app/forms/crag-form/crag-form.component';
import {
  CragsQuery,
  CragsGQL,
  Country,
  Area,
  Crag,
  CountriesTocQuery,
} from '../../../generated/graphql';
import { GraphQLError } from 'graphql';
import { FormControl } from '@angular/forms';

declare var ol: any;

@Component({
  selector: 'app-crags',
  templateUrl: './crags.component.html',
  styleUrls: ['./crags.component.scss'],
})
export class CragsComponent implements OnInit {
  loading: boolean = true;
  cragsLoading: boolean = false;
  error: DataError = null;

  countries: CragsQuery['countryBySlug'][];
  country: CragsQuery['countryBySlug'];

  crags$ = new BehaviorSubject<CragsQuery['countryBySlug']['crags']>([]);

  map: any;

  search = new FormControl();

  filteredCrags: CragsQuery['countryBySlug']['crags'] = [];

  constructor(
    private layoutService: LayoutService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private cragsGQL: CragsGQL
  ) {}

  ngOnInit(): void {
    this.layoutService.$breadcrumbs.next([
      {
        name: 'Plezališča',
      },
    ]);

    this.loading = true;

    this.activatedRoute.params.subscribe((params) => {
      this.cragsLoading = true;

      this.cragsGQL
        .fetch({
          country: params.country,
          input: {
            area: params.area,
            routeType: params.type,
          },
        })
        .subscribe((result) => {
          this.loading = false;
          this.cragsLoading = false;

          if (result.errors != null) {
            this.queryError(result.errors);
          } else {
            this.querySuccess(result.data.countryBySlug);
          }
        });
    });

    this.search.valueChanges.subscribe(() => this.filterCrags());
  }

  filterCrags(): void {
    this.filteredCrags =
      this.search.value == null
        ? this.country.crags
        : this.country.crags.filter(
            (crag) =>
              crag.name.toLowerCase().indexOf(this.search.value.toLowerCase()) >
              -1
          );
    this.crags$.next(this.filteredCrags);
  }

  searchKeyDown(e: KeyboardEvent) {
    if (e.key == 'Enter' && this.filteredCrags.length == 1) {
      this.router.navigate([
        '/plezalisca',
        this.country.slug,
        this.filteredCrags[0].slug,
      ]);
    }
  }

  queryError(errors: readonly GraphQLError[]) {
    if (errors.length > 0 && errors[0].message == 'entity_not_found') {
      this.error = {
        message: 'Država ne obstaja v bazi.',
      };
      return;
    }

    this.error = {
      message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
    };
  }

  querySuccess(country: CragsQuery['countryBySlug']) {
    this.country = country;

    this.filterCrags();

    this.layoutService.$breadcrumbs.next([
      {
        name: 'Plezališča',
        path: '/plezalisca',
      },
      {
        name: this.country.name,
      },
    ]);
  }

  addCrag() {
    this.dialog
      .open(CragFormComponent, {
        data: {
          countryId: this.country.id,
        },
      })
      .afterClosed()
      .subscribe((data) => {
        console.log(data);
      });
  }
}
