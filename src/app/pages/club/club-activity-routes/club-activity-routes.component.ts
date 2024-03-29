import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { QueryRef } from 'apollo-angular';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, filter, switchMap, take } from 'rxjs/operators';
import { ASCENT_TYPES } from 'src/app/common/activity.constants';
import { FilteredTable } from 'src/app/common/filtered-table';
import { DataError } from 'src/app/types/data-error';
import {
  ActivityFiltersCragGQL,
  ActivityFiltersRouteGQL,
  ActivityRoute,
  ActivityRoutesByClubSlugGQL,
  ActivityRoutesByClubSlugQuery,
  Club,
} from 'src/generated/graphql';
import { ClubService } from '../club.service';

@Component({
  selector: 'app-club-activity-routes',
  templateUrl: './club-activity-routes.component.html',
  styleUrls: ['./club-activity-routes.component.scss'],
})
export class ClubActivityRoutesComponent implements OnInit, OnDestroy {
  loading = true;
  error: DataError = null;

  activityRoutesQuery: QueryRef<any>;

  activityRoutes: ActivityRoutesByClubSlugQuery['activityRoutesByClubSlug']['items'];
  pagination: ActivityRoutesByClubSlugQuery['activityRoutesByClubSlug']['meta'];

  filteredTable = new FilteredTable(
    [
      { name: 'user', label: 'Član' },
      { name: 'date', label: 'Datum', sortable: true, defaultSort: 'DESC' },
      { name: 'crag', label: 'Plezališče' },
      { name: 'route', label: 'Smer' },
      { name: 'grade', label: 'Ocena', sortable: true },
      { name: 'ascentType', label: 'Tip vzpona' },
    ],
    [
      { name: 'dateFrom', type: 'date' },
      { name: 'dateTo', type: 'date' },
      { name: 'ascentType', type: 'multiselect' },
      { name: 'userId', type: 'relation' },
      { name: 'routeId', type: 'relation' },
      { name: 'cragId', type: 'relation' },
    ]
  );

  filters = new FormGroup({
    dateFrom: new FormControl(),
    dateTo: new FormControl(),
    ascentType: new FormControl(),
    userId: new FormControl(),
    routeId: new FormControl(),
    cragId: new FormControl(),
  });

  ascentTypes = ASCENT_TYPES;
  ALLOWED_PUBLISH_TYPES = ['club', 'log', 'public'];

  filterCragName: string;
  filterRouteName: string;
  filterMemberFullName: string;

  rowAction$ = new Subject<{
    item: ActivityRoute;
    action: string;
  }>();

  ftNavSubscription: Subscription;
  arSubscription: Subscription;
  raSubscription: Subscription;
  memberAddedSubscription: Subscription;
  filtersSubscription: Subscription;
  clubSubscription: Subscription;
  ignoreFormChange = true;

  noTopropeOnPage = false;

  club: Club;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private activityFiltersCragGQL: ActivityFiltersCragGQL,
    private activityFiltersRouteGQL: ActivityFiltersRouteGQL,
    private activityRoutesByClubSlugGQL: ActivityRoutesByClubSlugGQL,
    private clubService: ClubService
  ) {}

  ngOnInit(): void {
    const clubSlug = this.activatedRoute.snapshot.parent.params.club;

    this.clubSubscription = this.clubService.club$.subscribe({
      next: (club: Club) => {
        this.club = club;
      },
    });

    // A new member can also be added on club-activity-routes page
    this.memberAddedSubscription = this.clubService.memberAdded$.subscribe(
      () => {
        this.activityRoutesQuery.refetch();
      }
    );

    this.ftNavSubscription = this.filteredTable.navigate$.subscribe(
      (ftParams) => {
        return this.router.navigate([
          '/moj-profil/moji-klubi',
          clubSlug,
          'vzponi',
          ftParams,
        ]);
      }
    );

    this.arSubscription = this.activatedRoute.params
      .pipe(
        switchMap((params: Params) => {
          this.loading = true;

          this.filteredTable.setRouteParams(params);

          this.ignoreFormChange = true;
          this.filters.patchValue(this.filteredTable.filterParams, {
            emitEvent: false,
          });

          const queryParams = this.filteredTable.queryParams;

          this.activityRoutesQuery = this.activityRoutesByClubSlugGQL.watch({
            clubSlug: clubSlug,
            input: { ...queryParams, publish: this.ALLOWED_PUBLISH_TYPES },
          });

          return this.activityRoutesQuery.valueChanges;
        })
      )
      .subscribe({
        next: (result: any) => {
          this.loading = false;
          this.ignoreFormChange = false;

          this.querySuccess(result.data);
        },
        error: (error) => {
          this.clubService.emitError(error);
        },
      });

    this.filtersSubscription = this.filters.valueChanges
      .pipe(
        filter(() => {
          return !this.ignoreFormChange; // date picker ignores emitEvent:false. This is a workaround
        }),
        debounceTime(100) // datepicker triggers 4 valueChanges events. this is a workaround
      )
      .subscribe((values) => {
        this.filteredTable.setFilterParams(values);
      });

    this.raSubscription = this.rowAction$.subscribe((action) => {
      switch (action.action) {
        case 'filterByMember':
          this.filters.patchValue({
            userId: action.item.user.id,
          });
          this.filterMemberFullName = action.item.user.fullName;
          break;
        case 'filterByRoute':
          this.filters.patchValue({
            cragId: null,
            routeId: action.item.route.id,
          });
          this.filterRouteName = action.item.route.name;
          break;
        case 'filterByCrag':
          this.filters.patchValue({
            routeId: null,
            cragId: action.item.route.crag.id,
          });
          this.filterCragName = action.item.route.crag.name;
          break;
      }
    });
  }

  querySuccess(data: any) {
    this.activityRoutes = data.activityRoutesByClubSlug.items;
    this.pagination = data.activityRoutesByClubSlug.meta;

    this.noTopropeOnPage = !this.activityRoutes.some(
      (route) =>
        this.ascentTypes.find((at) => at.value === route.ascentType).topRope
    );

    this.applyRelationFilterDisplayValues();
  }

  applyRelationFilterDisplayValues() {
    // if the filter is applied, any row should have a matching routeName, so take first
    if (this.filters.controls.routeId.value && !this.filterRouteName) {
      if (this.activityRoutes.length) {
        this.filterRouteName = this.activityRoutes[0].route.name;
      } else {
        // but if result set is empty (can be on page load) we have to fetch
        this.activityFiltersRouteGQL
          .fetch({ id: this.filters.value.routeId })
          .pipe(take(1))
          .subscribe((route) => (this.filterRouteName = route.data.route.name));
      }
    }
    if (this.filters.controls.cragId.value && !this.filterCragName) {
      if (this.activityRoutes.length) {
        this.filterCragName = this.activityRoutes[0].route.crag.name;
      } else {
        this.activityFiltersCragGQL
          .fetch({ id: this.filters.value.cragId })
          .pipe(take(1))
          .subscribe((crag) => (this.filterCragName = crag.data.crag.name));
      }
    }
    if (this.filters.controls.userId.value && !this.filterMemberFullName) {
      this.filterMemberFullName = this.club.members.filter(
        (member) => member.user.id === this.filters.controls.userId.value
      )[0].user.fullName;
    }
  }

  ngOnDestroy() {
    this.ftNavSubscription.unsubscribe();
    this.arSubscription.unsubscribe();
    this.filtersSubscription.unsubscribe();
    this.raSubscription.unsubscribe();
    this.memberAddedSubscription.unsubscribe();
    this.clubSubscription.unsubscribe();
  }
}
