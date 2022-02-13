import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/services/layout.service';
import { PeaksCountriesGQL, PeaksCountriesQuery } from 'src/generated/graphql';

@Component({
  selector: 'app-peaks-countries',
  templateUrl: './peaks-countries.component.html',
  styleUrls: ['./peaks-countries.component.scss'],
})
export class PeaksCountriesComponent implements OnInit, OnDestroy {
  constructor(
    private layoutService: LayoutService,
    private peaksCountriesGQL: PeaksCountriesGQL
  ) {}

  loading = true;
  error = false;
  subscription: Subscription;

  peaksCountries: PeaksCountriesQuery['countries'];

  ngOnInit(): void {
    this.subscription = this.peaksCountriesGQL.fetch().subscribe({
      next: (result) => {
        this.peaksCountries = result.data.countries;
        this.setBreadcrumbs();
        this.loading = false;
      },
      error: () => {
        this.error = true;
      },
    });
  }

  private setBreadcrumbs() {
    this.layoutService.$breadcrumbs.next([
      {
        name: 'Alpinizem',
        path: '/alpinizem',
      },
      {
        name: 'Vrhovi',
      },
    ]);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
