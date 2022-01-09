import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CountriesTocGQL,
  Country,
  IceFallCountriesTocGQL,
  IceFallCountriesTocQuery,
} from '../../../../../generated/graphql';

@Component({
  selector: 'app-areas-toc',
  templateUrl: './areas-toc.component.html',
  styleUrls: ['./areas-toc.component.scss'],
})
export class AreasTocComponent implements OnInit {
  @Input() country: Country;

  countries: IceFallCountriesTocQuery['countries'];

  params: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private countriesTocGQL: IceFallCountriesTocGQL
  ) {}

  ngOnInit(): void {
    this.countriesTocGQL
      .watch()
      .valueChanges.subscribe(
        (result) =>
          (this.countries = result.data.countries
            .filter((c) => c.iceFalls.length > 0)
            .sort((a, b) => (a.iceFalls.length < b.iceFalls.length ? 1 : -1)))
      );

    this.activatedRoute.params.subscribe((params) => {
      this.params = { ...params };
      delete this.params.country;
    });
  }

  changeCountry(slug: string) {
    this.router.navigate(this.makeRoute(slug, { area: null }));
  }

  makeRoute(country: string, params: any = {}) {
    return ['/slapovi', country, this.routeParams(params)];
  }

  routeParams(params: any): any {
    params = { ...this.params, ...params };

    Object.keys(params).forEach((key) => {
      if (params[key] == null) {
        delete params[key];
      }
    });

    return params;
  }
}
