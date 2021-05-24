import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { QueryRef } from 'apollo-angular';
import { GraphQLError } from 'graphql';
import { Subject, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { ASCENT_TYPES } from 'src/app/common/activity.constants';
import { FilteredTable } from 'src/app/common/filtered-table';
import { ClubMemberFormComponent } from 'src/app/forms/club-member-form/club-member-form.component';
import { LayoutService } from 'src/app/services/layout.service';
import { DataError } from 'src/app/types/data-error';
import {
  ActivityFiltersCragGQL,
  ActivityFiltersRouteGQL,
  ActivityRoute,
  UserFullNameGQL,
  ActivityRoutesByClubGQL,
  ClubByIdGQL,
  Club,
  ClubMember,
} from 'src/generated/graphql';

// TODO: should query only activityRoutes with the right publish type. what are the right publish types?
// TODO: should be unable to get club data if I am not a member? BE
// TODO: should have nice url with no id, but slug? FE/BE
// TODO: keep scroll position when paginating? what is the expected behaviour?
// TODO: sort on grade not working as expected -> some activityRoutes have no grade field (only difficulty field)...

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.scss'],
})
export class ClubComponent implements OnInit, OnDestroy {
  error: DataError = null;
  loading = true;

  club: any = {}; // TODO: type
  clubAdmin = false;

  activityRoutesQuery: QueryRef<any>;

  activityRoutes: any; // TODO: type
  pagination: any; // TODO: type

  filteredTable = new FilteredTable(
    [
      { name: 'user', label: 'Član' },
      { name: 'date', label: 'Datum', sortable: true, defaultSort: 'DESC' },
      { name: 'crag', label: 'Plezališče' },
      { name: 'route', label: 'Smer' },
      { name: 'grade', label: 'Ocena', sortable: true },
    ],
    [
      // { name: 'dateFrom', type: 'date' },  // TODO:
      // { name: 'dateTo', type: 'date' },  // TODO:
      { name: 'ascentType', type: 'multiselect' },
      { name: 'userId', type: 'relation' }, // TODO: would multiselect be better?
      { name: 'routeId', type: 'relation' },
      { name: 'cragId', type: 'relation' },
    ]
  );

  filters = new FormGroup({
    // dateFrom: new FormControl(), // TODO:
    // dateTo: new FormControl(), // TODO:
    ascentType: new FormControl(),
    userId: new FormControl(),
    routeId: new FormControl(),
    cragId: new FormControl(),
  });

  ascentTypes = ASCENT_TYPES;

  filterCragName: string;
  filterRouteName: string;
  filterMemberFullName: string;

  rowAction$ = new Subject<{
    item: ActivityRoute;
    action: string;
  }>();

  ftNavSubscription: Subscription;
  filtersSubscription: Subscription;
  arSubscription: Subscription;
  raSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private activityFiltersCragGQL: ActivityFiltersCragGQL,
    private activityFiltersRouteGQL: ActivityFiltersRouteGQL,
    private clubByIdGQL: ClubByIdGQL,
    private activityRoutesByClubGQL: ActivityRoutesByClubGQL,
    private userFullNameGQL: UserFullNameGQL
  ) {}

  ngOnInit(): void {
    // Get data for the club
    const clubId = this.activatedRoute.snapshot.params.club;
    this.clubByIdGQL.fetch({ clubId: clubId }).subscribe((data: any) => {
      if (data.errors != null) {
        this.queryError(data.errors);
        return;
      }

      this.club = data.data.club;
      this.setBreadcrumbs();

      // TODO: implement amAdmin on clubMember resolver on BE?
      this.clubAdmin = this.club.members.some(
        (member: ClubMember) =>
          member.user.id === this.authService.currentUser.id && member.admin
      );
    });

    this.ftNavSubscription = this.filteredTable.navigate$.subscribe(
      (ftParams) => {
        return this.router.navigate([
          '/moj-profil/moji-klubi',
          clubId,
          ftParams,
        ]);
      }
    );

    this.arSubscription = this.activatedRoute.params
      .pipe(
        switchMap((params: Params) => {
          this.loading = true;

          const ftParams = { ...params };
          delete ftParams.club;

          this.filteredTable.setRouteParams(ftParams);

          this.filters.patchValue(this.filteredTable.filterParams, {
            emitEvent: false,
          });

          const queryParams = this.filteredTable.queryParams;

          this.activityRoutesQuery = this.activityRoutesByClubGQL.watch({
            clubId: params.club,
            input: queryParams,
          });

          return this.activityRoutesQuery.valueChanges;
        })
      )
      .subscribe((data: any) => {
        this.loading = false;

        if (data.errors != null) {
          this.queryError(data.errors);
        } else {
          this.querySuccess(data.data);
        }
      });

    // TODO: why datepicker fires 4 times? BUG?
    this.filtersSubscription = this.filters.valueChanges.subscribe((values) =>
      this.filteredTable.setFilterParams(values)
    );

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
          this.filterRouteName = action.item.name;
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

  setBreadcrumbs() {
    this.layoutService.$breadcrumbs.next([
      {
        name: 'Moj Profil',
        path: '/moj-profil',
      },
      {
        name: 'Moji Klubi',
        path: '/moj-profil/moji-klubi',
      },
      {
        name: this.club.name,
      },
    ]);
  }

  queryError(errors: GraphQLError[]) {
    if (
      errors.length > 0 &&
      errors[0].message.startsWith('Could not find any entity of type')
    ) {
      this.error = {
        message: 'Klub ne obstaja.',
      };
      return;
    }

    this.error = {
      message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
    };
  }

  querySuccess(data: any) {
    this.activityRoutes = data.activityRoutesByClub.items;
    this.pagination = data.activityRoutesByClub.meta;
    this.applyRelationFilterDisplayValues();
  }

  applyRelationFilterDisplayValues() {
    // if the filter is applied, any row should have a matching routeName, so take first
    if (this.filters.controls.routeId.value && !this.filterRouteName) {
      if (this.activityRoutes.length) {
        this.filterRouteName = this.activityRoutes[0].name;
      } else {
        // but if result set is empty (can be on page load) we have to fetch
        this.activityFiltersRouteGQL
          .fetch({ id: this.filters.value.routeId })
          .toPromise()
          .then((route) => (this.filterRouteName = route.data.route.name));
      }
    }
    if (this.filters.controls.cragId.value && !this.filterCragName) {
      if (this.activityRoutes.length) {
        this.filterCragName = this.activityRoutes[0].route.crag.name;
      } else {
        this.activityFiltersCragGQL
          .fetch({ id: this.filters.value.cragId })
          .toPromise()
          .then((crag) => (this.filterCragName = crag.data.crag.name));
      }
    }
    if (this.filters.controls.userId.value && !this.filterMemberFullName) {
      if (this.activityRoutes.length) {
        this.filterMemberFullName = this.activityRoutes[0].user.fullName;
      } else {
        this.userFullNameGQL
          .fetch({ userId: this.filters.controls.userId.value })
          .toPromise()
          .then(
            (member: any) =>
              (this.filterMemberFullName = member.data.user.fullName)
          );
      }
    }
  }

  // TODO: add option to remove a member

  addMember() {
    this.dialog
      .open(ClubMemberFormComponent, {
        data: { clubId: this.club.id, clubName: this.club.name },
      })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          this.activityRoutesQuery.refetch();
        }
      });
  }

  ngOnDestroy() {
    this.ftNavSubscription.unsubscribe();
    this.arSubscription.unsubscribe();
    this.filtersSubscription.unsubscribe();
    this.raSubscription.unsubscribe();
  }
}
