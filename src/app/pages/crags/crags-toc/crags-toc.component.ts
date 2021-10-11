import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  CountriesTocGQL,
  CountriesTocQuery,
  Country,
} from '../../../../generated/graphql';
import { Tab } from 'src/app/types/tab';

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

  routeTypes: Tab[] = [
    {
      slug: 'sport',
      label: 'Športne',
    },
    {
      slug: 'boulder',
      label: 'Balvani',
    },
    {
      slug: 'multipitch',
      label: 'Večraztežajne',
    },
  ];

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

  changeArea(id: string) {
    this.router.navigate(this.makeRoute(this.country.slug, { area: id }));
  }

  changeCountry(slug: string) {
    this.router.navigate(this.makeRoute(slug, { area: null }));
  }

  changeType(slug: string) {
    this.router.navigate(this.makeRoute(this.country.slug, { type: slug }));
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
