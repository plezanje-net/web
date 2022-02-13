import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GraphQLError } from 'graphql';

import {
  Area,
  Country,
  IceFall,
  IceFallsCountryGQL,
  IceFallsCountryQuery,
} from '../../../../generated/graphql';
import { LayoutService } from '../../../services/layout.service';
import { DataError } from '../../../types/data-error';

interface FlatArea {
  area: Area;
  nrIceFalls: number;
  depth: number;
}

@Component({
  selector: 'app-areas',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {
  loading: boolean = true;
  error: DataError = null;

  country: Country;

  areas: FlatArea[];
  countries: Country[];
  iceFalls: IceFall[];

  areaSlug: string;

  constructor(
    private layoutService: LayoutService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private iceFallsCountryGQL: IceFallsCountryGQL
  ) {}

  ngOnInit(): void {
    this.layoutService.$breadcrumbs.next([
      {
        name: 'Slapovi',
      },
    ]);

    this.loading = true;

    this.activatedRoute.params.subscribe((params) => {
      this.areaSlug = params.obmocje;
      this.iceFallsCountryGQL
        .watch({
          countrySlug: params.country,
          areaSlug: params.obmocje,
        })
        .valueChanges.subscribe({
          next: (result) => {
            this.loading = false;
            this.querySuccess(result.data);
          },
          error: () => {
            this.loading = false;
            this.queryError();
          },
        });
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

  querySuccess(result: IceFallsCountryQuery) {
    this.areas = this.countIceFallsAndFlatten(
      <Area[]>result.countryAreas.areas
    ).filter((area) => area.nrIceFalls > 0);

    this.country = <Country>result.countryAreas;
    this.countries = <Country[]>result.countries;
    this.iceFalls = <IceFall[]>result.countryIceFalls.iceFalls;

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

  changeCountry(slug: string) {
    this.router.navigate(['/alpinizem/slapovi/drzava', slug]);
  }

  changeArea(slug: string) {
    this.router.navigate([
      '/alpinizem/slapovi/drzava',
      this.country.slug,
      { obmocje: slug },
    ]);
  }

  private countIceFallsAndFlatten(areas: Area[]): FlatArea[] {
    const flatAndCountedAreas = [];
    areas.forEach((area) => {
      flatAndCountedAreas.push(...this.countIceFallsInBranchAndFlatten(area));
    });
    return flatAndCountedAreas;
  }

  private countIceFallsInBranchAndFlatten(
    area: Area,
    depth: number = 0
  ): FlatArea[] {
    // if area has no descendants then branch icefall count is number of icefalls in this area
    if (!area.areas?.length) {
      return [
        {
          area: area,
          nrIceFalls: area.iceFalls.length,
          depth: depth,
        },
      ];
    }

    // if area has descendants then count is number of ice falls in this area + number of ice falls in descendant branches
    let sum = area.iceFalls.length;
    const flatChildAreasWithIceFallsCount = [];
    area.areas.forEach((area) => {
      const childAreaWICnt = this.countIceFallsInBranchAndFlatten(
        area,
        depth + 1
      );
      flatChildAreasWithIceFallsCount.push(...childAreaWICnt);
      sum += childAreaWICnt[0].nrIceFalls;
    });

    const currentArea = {
      area,
      nrIceFalls: sum,
      depth: depth,
    };

    return [currentArea, ...flatChildAreasWithIceFallsCount];
  }
}
