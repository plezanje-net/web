import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GraphQLError } from 'graphql';
import { BehaviorSubject } from 'rxjs';
import {
  Area,
  CragsQuery,
  IceFallAreasGQL,
  IceFallAreasQuery,
} from '../../../../generated/graphql';
import { LayoutService } from '../../../services/layout.service';
import { DataError } from '../../../types/data-error';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss'],
})
export class AreasComponent implements OnInit {
  loading: boolean = true;
  error: DataError = null;

  country: IceFallAreasQuery['countryBySlug'];

  constructor(
    private layoutService: LayoutService,
    private activatedRoute: ActivatedRoute,
    private iceFallAreasGQL: IceFallAreasGQL
  ) {}

  ngOnInit(): void {
    this.layoutService.$breadcrumbs.next([
      {
        name: 'Slapovi',
      },
    ]);

    this.loading = true;

    this.activatedRoute.params.subscribe((params) => {
      this.iceFallAreasGQL
        .fetch({
          country: params.country,
        })
        .subscribe(
          (result) => {
            this.loading = false;

            if (result.errors != null) {
              this.queryError(result.errors);
            } else {
              this.querySuccess(result.data.countryBySlug);
            }
          },
          (_) => {
            this.loading = false;
            this.queryError();
          }
        );
    });
  }

  queryError(errors?: readonly GraphQLError[]) {
    if (
      errors &&
      errors.length > 0 &&
      errors[0].message == 'entity_not_found'
    ) {
      this.error = {
        message: 'Država ne obstaja v bazi.',
      };
      return;
    }

    this.error = {
      message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
    };
  }

  querySuccess(country: IceFallAreasQuery['countryBySlug']) {
    this.country = country;

    this.layoutService.$breadcrumbs.next([
      {
        name: 'Slapovi',
        path: '/slapovi',
      },
      {
        name: this.country.name,
      },
    ]);
  }
}
