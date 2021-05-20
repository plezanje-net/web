import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/services/layout.service';
import { DataError } from '../../types/data-error';
import { ActivatedRoute } from '@angular/router';
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

  area: Area;

  map: any;

  constructor(
    private layoutService: LayoutService,
    private activatedRoute: ActivatedRoute,
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
      this.area = params.area;

      this.cragsGQL
        .fetch({
          country: params.country,
          area: params.area,
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

    this.crags$.next(this.country.crags);

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
