import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { LayoutService } from 'src/app/services/layout.service';
import { PeakBySlugGQL, PeakBySlugQuery } from 'src/generated/graphql';

@Component({
  selector: 'app-peak-crags',
  templateUrl: './peak-crags.component.html',
  styleUrls: ['./peak-crags.component.scss'],
})
export class PeakCragsComponent implements OnInit {
  loading = true;
  error = false;

  peak: PeakBySlugQuery['peak'];

  constructor(
    private activatedRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private peakBySlugGQL: PeakBySlugGQL
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap((params) => {
          const peakSlug = params.peak;
          return this.peakBySlugGQL.fetch({ slug: peakSlug });
        })
      )
      .subscribe({
        next: (result) => {
          this.peak = result.data.peak;
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
        name: this.peak.country.name,
        path: '/alpinizem/vrhovi/drzava/' + this.peak.country.slug,
      },
      {
        name: this.peak.name,
      },
    ]);
  }
}
