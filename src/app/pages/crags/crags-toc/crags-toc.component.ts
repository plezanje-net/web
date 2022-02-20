import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CountriesTocGQL,
  CountriesTocQuery,
  Country,
} from '../../../../generated/graphql';
import { ROUTE_TYPES } from 'src/app/common/route-types.constants';

@Component({
  selector: 'app-crags-toc',
  templateUrl: './crags-toc.component.html',
  styleUrls: ['./crags-toc.component.scss'],
})
export class CragsTocComponent implements OnInit {
  @Input() country: Country;

  countries: CountriesTocQuery['countries'];

  showAllCountries: boolean = false;

  params: any;

  routeTypes = ROUTE_TYPES;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private countriesTocGQL: CountriesTocGQL
  ) {}

  ngOnInit(): void {
    this.countriesTocGQL
      .watch()
      .valueChanges.subscribe(
        (result) => (this.countries = result.data.countries)
      );

    this.activatedRoute.params.subscribe((params) => {
      this.params = { ...params };
      delete this.params.country;
    });
  }

  changeArea(slug: string) {
    this.router.navigate(this.makeRoute(this.country.slug, { obmocje: slug }));
  }

  changeCountry(slug: string) {
    this.router.navigate(this.makeRoute(slug, { obmocje: null }));
  }

  changeType(slug: string) {
    this.router.navigate(this.makeRoute(this.country.slug, { tip: slug }));
  }

  makeRoute(country: string, params: any = {}) {
    return ['/plezalisca', country, this.routeParams(params)];
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
