import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/services/layout.service';
import { PeaksCountriesGQL, PeaksCountriesQuery } from 'src/generated/graphql';

@Component({
  selector: 'app-peaks-countries',
  templateUrl: './peaks-countries.component.html',
  styleUrls: ['./peaks-countries.component.scss'],
})
export class PeaksCountriesComponent implements OnInit {
  constructor(
    private layoutService: LayoutService,
    private peaksCountriesGQL: PeaksCountriesGQL
  ) {}

  loading = true;
  error = false;

  peaksCountries: PeaksCountriesQuery['countries'];

  ngOnInit(): void {
    this.peaksCountriesGQL.fetch().subscribe({
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
      },
      {
        name: 'Vrhovi',
        path: '/alpinizem/vrhovi/drzave',
      },
      {
        name: 'Države',
      },
    ]);
  }
}
