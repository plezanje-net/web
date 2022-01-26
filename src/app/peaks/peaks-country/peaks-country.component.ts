import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { switchMap } from 'rxjs';
import { LayoutService } from 'src/app/services/layout.service';
import { PeaksCountryGQL, PeaksCountryQuery } from 'src/generated/graphql';

type Area = {
  __typename?: 'Area';
  name: string;
  slug: string;
  peaks: Array<{ __typename?: 'Peak'; name: string }>;
  branchNrPeaks?: number;
  areas?: Areas;
};

type Areas = Array<Area>;

@Component({
  selector: 'app-peaks-country',
  templateUrl: './peaks-country.component.html',
  styleUrls: ['./peaks-country.component.scss'],
})
export class PeaksCountryComponent implements OnInit {
  loading = true;
  error = false;

  countrySlug: string;
  areaSlug = '';
  peaks: PeaksCountryQuery['countryPeaks']['peaks'];
  countries: PeaksCountryQuery['countries'];
  areas: Areas;
  showEmptyAreas = false; // toggle this to show/hide areas with no peaks (branchwise)

  constructor(
    private layoutService: LayoutService,
    private activatedRoute: ActivatedRoute,
    private peaksCountryGQL: PeaksCountryGQL
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap((params) => {
          this.loading = true;
          this.countrySlug = params.country;
          this.areaSlug = params.area;

          return this.peaksCountryGQL.fetch(
            {
              countrySlug: this.countrySlug,
              areaSlug: this.areaSlug,
            },
            {}
          );
        })
      )
      .subscribe({
        next: (result) => {
          this.peaks = result.data.countryPeaks.peaks;
          this.countries = result.data.countries;
          this.areas = result.data.countryAreas.areas;
          this.areas = this.countPeaksAndFlatten(this.areas);
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
        path: '/alpinizem/vrhovi/drzave',
      },
      {
        name: this.peaks[0].country.name,
      },
    ]);
  }

  private countPeaksAndFlatten(areas: Areas) {
    const flatAndCountedAreas = [];
    areas.forEach((area) => {
      flatAndCountedAreas.push(...this.countPeaksInBranchAndFlatten(area));
    });
    return flatAndCountedAreas;
  }

  private countPeaksInBranchAndFlatten(area: Area, depth: number = 0) {
    // if area has no descendants then branch peak count is number of peaks in this area
    if (!area.areas?.length) {
      return [
        {
          ...area,
          branchNrPeaks: area.peaks.length,
          depth: depth,
        },
      ];
    }

    // if area has descendants then count is number of peaks in this area + number of peaks in descendant branches
    let sum = area.peaks.length;
    const flatChildAreasWithPeakCount = [];
    area.areas.forEach((area) => {
      const childAreaWPCnt = this.countPeaksInBranchAndFlatten(area, depth + 1);
      flatChildAreasWithPeakCount.push(...childAreaWPCnt);
      sum += childAreaWPCnt[0].branchNrPeaks;
    });

    const currentArea = {
      ...area,
      branchNrPeaks: sum,
      depth: depth,
    };

    return [currentArea, ...flatChildAreasWithPeakCount];
  }
}
