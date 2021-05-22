import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { GraphQLError } from 'graphql';
import { Subject, Subscription } from 'rxjs';
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
} from 'src/generated/graphql';

// TODO: move queries to grapql queries folder
const GET_MEMBER_NAME = gql`
  query getUserById($userId: String!) {
    user(email: "", id: $userId) {
      fullName
    }
  }
`;

const GET_CLUB_ACTIVITY_ROUTES = gql`
  query getActivityRoutesByClub(
    $clubId: String!
    $input: FindActivityRoutesInput
  ) {
    activityRoutesByClub(clubId: $clubId, input: $input) {
      items {
        date
        user {
          id
          fullName
        }
        grade
        name
        ascentType
        difficulty
        id
        publish
        route {
          crag {
            country {
              slug
            }
            slug
            name
            id
          }
          id
        }
      }
      meta {
        itemCount
        pageCount
        pageNumber
        pageSize
      }
    }

    club(id: $clubId) {
      id
      name
      members {
        admin
        user {
          id
          fullName
        }
      }
    }
  }
`;
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

  clubQuery: QueryRef<any>;
  querySubscription: Subscription;
  clubActivityRoutesQuery: QueryRef<any>;
  clubActivityRoutesQuerySubscription: Subscription;

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

  ftNavSubscription: Subscription;
  rowAction$ = new Subject<{
    item: ActivityRoute;
    action: string;
  }>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private apollo: Apollo,
    private layoutService: LayoutService,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private activityFiltersCragGQL: ActivityFiltersCragGQL,
    private activityFiltersRouteGQL: ActivityFiltersRouteGQL
  ) {}

  ngOnInit(): void {
    const clubId = this.activatedRoute.snapshot.params.club;

    this.ftNavSubscription = this.filteredTable.navigate$.subscribe(
      (ftParams) => {
        return this.router.navigate([
          '/moj-profil/moji-klubi',
          clubId,
          ftParams,
        ]);
      }
    );

    this.activatedRoute.params.subscribe((params: Params) => {
      this.loading = true;

      const ftParams = { ...params };
      delete ftParams.club;

      this.filteredTable.setRouteParams(ftParams);

      this.filters.patchValue(this.filteredTable.filterParams, {
        emitEvent: false,
      });

      const queryParams = this.filteredTable.queryParams;
      this.clubActivityRoutesQuery = this.apollo.watchQuery({
        query: GET_CLUB_ACTIVITY_ROUTES,
        variables: {
          clubId: params.club,
          input: queryParams,
        },
      });
      this.clubActivityRoutesQuerySubscription =
        this.clubActivityRoutesQuery.valueChanges.subscribe((result: any) => {
          this.loading = false;
          if (result.errors != null) {
            this.queryError(result.errors);
          } else {
            this.querySuccess(result.data);
          }
        });
    });

    // TODO: why datepicker fires 4 times? BUG?
    this.filters.valueChanges.subscribe((values) =>
      this.filteredTable.setFilterParams(values)
    );

    this.rowAction$.subscribe((action) => {
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
    this.club = data.club;

    // TODO: implement amAdmin on clubMember resolver on BE?
    this.clubAdmin = this.club.members.some(
      (member) =>
        member.user.id === this.authService.currentUser.id && member.admin
    );

    this.activityRoutes = data.activityRoutesByClub.items;
    this.pagination = data.activityRoutesByClub.meta;
    this.applyRelationFilterDisplayValues();

    // set breadcrumbs
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
        // TODO: move query to queries folder
        this.apollo
          .query({
            query: GET_MEMBER_NAME,
            variables: {
              userId: this.filters.controls.userId.value,
            },
          })
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
          this.clubActivityRoutesQuery.refetch();
        }
      });
  }

  ngOnDestroy() {
    this.clubActivityRoutesQuerySubscription.unsubscribe();
    this.ftNavSubscription.unsubscribe();
  }
}
