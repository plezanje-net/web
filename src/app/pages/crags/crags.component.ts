import { Component, OnDestroy, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/services/layout.service';
import { DataError } from '../../types/data-error';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject, Subscription, take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CragsQuery, CragsGQL } from '../../../generated/graphql';
import { GraphQLError } from 'graphql';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-crags',
  templateUrl: './crags.component.html',
  styleUrls: ['./crags.component.scss'],
})
export class CragsComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  cragsLoading: boolean = false;
  error: DataError = null;

  countries: CragsQuery['countryBySlug'][];
  country: CragsQuery['countryBySlug'];

  crags$ = new BehaviorSubject<CragsQuery['countryBySlug']['crags']>([]);

  map: any;

  search = new FormControl();
  searchSub: Subscription;

  filteredCrags: CragsQuery['countryBySlug']['crags'] = [];

  constructor(
    private layoutService: LayoutService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private cragsGQL: CragsGQL
  ) {}

  ngOnInit(): void {
    this.layoutService.$breadcrumbs.next([
      {
        name: 'Plezališča',
      },
    ]);

    this.loading = true;

    this.activatedRoute.params.subscribe((params) => {
      this.cragsLoading = true;

      this.cragsGQL
        .fetch({
          country: params.country,
          input: {
            areaSlug: params.area,
            routeTypeId: params.type,
          },
        })
        .pipe(take(1))
        .subscribe({
          next: (result) => {
            this.loading = false;
            this.cragsLoading = false;

            if (result.errors != null) {
              this.queryError(result.errors);
            } else {
              this.querySuccess(result.data.countryBySlug);
            }
          },
          error: () => {
            this.loading = false;
            this.queryError();
          },
        });
    });

    this.searchSub = this.search.valueChanges.subscribe(() =>
      this.filterCrags()
    );
  }

  filterCrags(): void {
    if (this.search.value == null) {
      this.filteredCrags = this.country.crags;
    } else {
      let searchTerm = this.search.value;
      searchTerm = searchTerm.toLowerCase();
      searchTerm = searchTerm.replace(/[cčć]/gi, '[cčć]');
      searchTerm = searchTerm.replace(/[sš]/gi, '[sš]');
      searchTerm = searchTerm.replace(/[zž]/gi, '[zž]');
      const regExp = new RegExp(searchTerm, 'gi');

      this.filteredCrags = this.country.crags.filter(
        (crag) => !!regExp.exec(crag.name.toLowerCase())
      );
    }

    this.crags$.next(this.filteredCrags);
  }

  searchKeyDown(e: KeyboardEvent) {
    if (e.key == 'Enter' && this.filteredCrags.length == 1) {
      this.router.navigate(['/plezalisce', this.filteredCrags[0].slug]);
    }
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

  querySuccess(country: CragsQuery['countryBySlug']) {
    this.country = country;

    this.filterCrags();

    this.layoutService.$breadcrumbs.next([
      {
        name: 'Plezališča',
        path: '/plezalisca',
      },
      {
        name: this.country.name,
      },
    ]);
  }

  ngOnDestroy(): void {
    this.searchSub.unsubscribe();
  }
}
