import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GraphQLError } from 'graphql';
import {
  Country,
  IceFallAreaGQL,
  IceFallAreaQuery,
} from '../../../../generated/graphql';
import { LayoutService } from '../../../services/layout.service';
import { DataError } from '../../../types/data-error';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss'],
})
export class AreaComponent implements OnInit {
  loading: boolean = true;
  dataLoading: boolean = false;
  error: DataError = null;

  area: IceFallAreaQuery['areaBySlug'];
  country: Country;

  constructor(
    private layoutService: LayoutService,
    private activatedRoute: ActivatedRoute,
    private iceFallAreaGQL: IceFallAreaGQL
  ) {}

  ngOnInit(): void {
    this.layoutService.$breadcrumbs.next([
      {
        name: 'Slapovi',
      },
    ]);

    this.loading = true;

    this.activatedRoute.params.subscribe((params) => {
      this.iceFallAreaGQL
        .fetch({
          area: params.area,
        })
        .subscribe(
          (result) => {
            this.loading = false;

            if (result.errors != null) {
              this.queryError(result.errors);
            } else {
              this.querySuccess(result.data.areaBySlug);
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
        message: 'Območje ne obstaja v bazi.',
      };
      return;
    }

    this.error = {
      message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
    };
  }

  querySuccess(area: IceFallAreaQuery['areaBySlug']) {
    this.area = area;
    this.country = <Country>area.country;

    this.layoutService.$breadcrumbs.next([
      {
        name: 'Slapovi',
        path: '/slapovi',
      },
      {
        name: this.area.name,
      },
    ]);
  }
}
