import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/services/layout.service';
import { CountriesGQL, Country } from 'src/generated/graphql';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss'],
})
export class CountriesComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  countries: Country[];

  constructor(
    private countriesGQL: CountriesGQL,
    private layoutService: LayoutService
  ) {}

  ngOnInit(): void {
    this.layoutService.$breadcrumbs.next([
      {
        name: 'Seznam držav',
      },
    ]);

    this.countriesGQL.watch().valueChanges.subscribe(({ data }) => {
      this.countries = [...(data.countries as Country[])].sort((a, b) =>
        a.name > b.name ? 1 : -1
      );
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  add(): void {}
}
