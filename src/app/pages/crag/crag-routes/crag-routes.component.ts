import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatDialog,} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { SnackBarButtonsComponent } from 'src/app/shared/snack-bar-buttons/snack-bar-buttons.component';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import dayjs from 'dayjs';
import ActivitySelection from 'src/app/types/activity-selection.interface';
import { Crag, MyCragSummaryGQL, Route, Sector } from 'src/generated/graphql';
import { KeyValue } from '@angular/common';
import { MatSelectChange } from '@angular/material/select';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SearchService } from 'src/app/shared/services/search.service';
import { CragActivityRouteComponent } from 'src/app/pages/crag/crag-route-activity/crag-activity-route.component';

@Component({
  selector: 'app-crag-routes',
  templateUrl: './crag-routes.component.html',
  styleUrls: ['./crag-routes.component.scss'],
})
export class CragRoutesComponent implements OnInit, OnDestroy {
  @Input() crag: Crag;

  sectors: (Sector & {
    sortedDirection?: number;
    sortedField?: string;
    someRoutesShown: boolean;
  })[] = [];

  // Provide some sensible default
  shownColumns = [
    'name',
    'length',
    'difficulty',
    'starRating',
    'multipitch',
    'comments',
    'myAscents',
  ];

  allColumns = {
    name: {
      field: 'name',
      selectLabel: 'Ime',
      tableLabel: 'Ime',
      defaultSortDirection: 1,
      width: 100,
    },
    length: {
      field: 'length',
      selectLabel: 'Dolžina',
      tableLabel: 'Dolžina',
      defaultSortDirection: 1,
      width: 85,
    },
    difficulty: {
      field: 'difficulty',
      selectLabel: 'Težavnost',
      tableLabel: 'Težavnost',
      defaultSortDirection: 1,
      width: 103,
    },
    nrTicks: {
      field: 'nrTicks',
      selectLabel: 'Število uspešnih vzponov',
      tableLabel: 'Uspešnih vzponov',
      defaultSortDirection: -1,
      width: 160,
    },
    nrTries: {
      field: 'nrTries',
      selectLabel: 'Število poskusov',
      tableLabel: 'Poskusov',
      defaultSortDirection: -1,
      width: 100,
    },
    nrClimbers: {
      field: 'nrClimbers',
      selectLabel: 'Število plezalcev',
      tableLabel: 'Plezalcev',
      defaultSortDirection: -1,
      width: 99,
    },
    starRating: {
      field: 'starRating',
      selectLabel: 'Lepota smeri',
      defaultSortDirection: -1,
      width: 36,
    },
    multipitch: {
      field: 'multipitch',
      selectLabel: 'Večraztežajna smer',
      defaultSortDirection: -1,
      width: 36,
    },
    comments: {
      field: 'comments',
      selectLabel: 'Smer ima komentarje',
      defaultSortDirection: -1,
      width: 36,
    },
    myAscents: {
      field: 'myAscents',
      selectLabel: 'Moji vzponi',
      defaultSortDirection: -1,
      width: 52,
    },
  };

  hostResizeObserver: ResizeObserver;
  routeListViewStyle: 'compact' | 'table';
  tableWidth: number;
  availableWidth: number = 0;
  sortAll = ['position', 1];
  search = new FormControl();
  searchSub: Subscription;

  selectedRoutes: Route[] = [];
  selectedRoutesIds: string[] = [];
  ascents: any = {};
  loading = false;
  expandedRowId: string;
  previousExpandedRowId: string;
  expandedRowHeight: number;

  section: string;

  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router,
    private myCragSummaryGQL: MyCragSummaryGQL,
    private localStorageService: LocalStorageService,
    private changeDetection: ChangeDetectorRef,
    private hostElement: ElementRef,
    private searchService: SearchService,
    private dialog: MatDialog
  ) {}

  openDialog(routeId, routeName) {
    const dialogRef = this.dialog.open(CragActivityRouteComponent, {
      data: {userId: this.authService.currentUser.getValue().id, routeId: routeId, routeName: routeName},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.router.navigate([
          '/plezalni-dnevnik/vzponi',
          { routeId: routeId },
        ]);
      }
    });
  }

  ngOnInit(): void {
    if (sessionStorage.getItem('shownColumns')) {
      this.shownColumns = JSON.parse(sessionStorage.getItem('shownColumns'));
    }

    // Hide length column if crag has only boulders
    if (this.crag.sectors.every((sector) => sector.bouldersOnly)) {
      delete this.allColumns.length;
      this.shownColumns = this.shownColumns.filter(
        (column) => column != 'length'
      );
    }

    this.recalculateTableWidth();

    this.hostResizeObserver = new ResizeObserver((entries) => {
      this.availableWidth = entries[0].contentRect.width;
    });
    this.hostResizeObserver.observe(this.hostElement.nativeElement);

    // Make a copy (original is readonly and cannot be sorted or extended with fields)
    this.crag.sectors.forEach((sector) => {
      const routes = [];
      sector.routes.forEach((route) => routes.push({ ...route, show: true }));
      this.sectors.push({ ...sector, someRoutesShown: true, routes: routes });
    });
    this.searchSub = this.search.valueChanges.subscribe(() => {
      this.filterRoutes();
    });

    this.section = this.router.url.includes('/alpinizem/stena')
      ? 'alpinism'
      : 'sport';

    this.authService.currentUser.subscribe((user) =>
      this.loadActivity(user != null)
    );

    const activitySelection: ActivitySelection =
      this.localStorageService.getItem('activity-selection');
    if (
      activitySelection &&
      activitySelection.routes.length &&
      activitySelection.crag.id === this.crag.id
    ) {
      this.selectedRoutes = activitySelection.routes;
      this.selectedRoutesIds = this.selectedRoutes.map((route) => route.id);
      this.openSnackBar();
    }
  }

  ngOnDestroy(): void {
    this.snackBar.dismiss();
    this.hostResizeObserver.disconnect();
    this.searchSub.unsubscribe();
  }

  onSelectedColumnsSelectionChange() {
    sessionStorage.setItem('shownColumns', JSON.stringify(this.shownColumns));
    this.recalculateTableWidth();
  }

  recalculateTableWidth() {
    this.tableWidth = this.shownColumns.reduce(
      (prev, curr) => prev + this.allColumns[curr].width,
      40
    );
  }

  /**
   * sorts routes in all sectors by the same sort field and direction
   * used when compact view is shown and sort can be selected only from select input
   */
  sortAllRoutes(event: MatSelectChange) {
    const [field, direction] = event.value;
    this.sectors.forEach((sector, index) => {
      this.sortRoutes(index, field, direction);
    });
  }

  onSortableHeaderClick(sectorIndex: number, sortField: string) {
    this.sortAll = null; // unset dropdown sort select input
    this.sortRoutes(sectorIndex, sortField);
  }

  /**
   * sorts routes in one sector
   * used when table view is shown and each sector can be sorted individually by clicking on fields in table header
   */
  sortRoutes(sectorIndex: number, sortField: string, sortDirection?: number) {
    if (sortDirection) {
      this.sectors[sectorIndex].sortedDirection = sortDirection;
    } else {
      if (sortField === 'position') {
        // sorting by position is always asc (left to right), sorting by any other field inverts direction on each click
        this.sectors[sectorIndex].sortedDirection = 1;
      } else {
        this.sectors[sectorIndex].sortedDirection =
          this.sectors[sectorIndex].sortedField === sortField
            ? this.sectors[sectorIndex].sortedDirection * -1
            : this.allColumns[sortField].defaultSortDirection ?? 1;
      }
    }

    this.sectors[sectorIndex].sortedField = sortField;

    this.sectors[sectorIndex].routes.sort((r1, r2) => {
      switch (this.sectors[sectorIndex].sortedField) {
        case 'difficulty':
          if (r1.isProject && r2.isProject) return 0;
          if (r1.isProject) return this.sectors[sectorIndex].sortedDirection;
          if (r2.isProject)
            return this.sectors[sectorIndex].sortedDirection * -1;
          break;

        case 'multipitch':
          if (r1.pitches.length && r2.pitches.length) return 0;
          if (r1.pitches.length)
            return this.sectors[sectorIndex].sortedDirection;
          if (r2.pitches.length)
            return this.sectors[sectorIndex].sortedDirection * -1;
          return 0;

        case 'comments':
          if (r1.comments.length && r2.comments.length) return 0;
          if (r1.comments.length)
            return this.sectors[sectorIndex].sortedDirection;
          if (r2.comments.length)
            return this.sectors[sectorIndex].sortedDirection * -1;
          return 0;

        case 'myAscents':
          if (this.ascents[r1.id] && this.ascents[r2.id]) return 0;
          if (this.ascents[r1.id])
            return this.sectors[sectorIndex].sortedDirection;
          if (this.ascents[r2.id])
            return this.sectors[sectorIndex].sortedDirection * -1;
          return 0;
      }

      // default sort mode:
      return r1[sortField] < r2[sortField]
        ? this.sectors[sectorIndex].sortedDirection * -1
        : this.sectors[sectorIndex].sortedDirection;
    });
  }

  filterRoutes(): void {
    let searchTerm = this.search.value;
    searchTerm = searchTerm.toLowerCase();
    searchTerm = this.searchService.escape(searchTerm);
    searchTerm = this.searchService.ignoreAccents(searchTerm);

    const regExp = new RegExp(searchTerm);

    this.sectors.forEach((sector) =>
      sector.routes.forEach(
        (route: Route & { show: boolean }) =>
          (route.show = regExp.test(route.name.toLowerCase()))
      )
    );

    this.sectors.forEach(
      (sector) =>
        (sector.someRoutesShown = sector.routes.some(
          (route: Route & { show: boolean }) => route.show
        ))
    );
  }

  onCheckBoxClick(event: Event) {
    event.stopPropagation();
  }

  changeSelection(route: Route): void {
    const i = this.selectedRoutes.findIndex((r) => r.id === route.id);
    if (i > -1) {
      this.selectedRoutes.splice(i, 1);
    } else {
      this.selectedRoutes.push(route);
    }

    if (this.selectedRoutes.length > 0) {
      this.openSnackBar();

      this.selectedRoutesIds = this.selectedRoutes.map(
        (selectedRoute) => selectedRoute.id
      );

      this.localStorageService.setItem(
        'activity-selection',
        {
          crag: this.crag,
          routes: this.selectedRoutes,
        },
        dayjs().add(1, 'day').toISOString()
      );
    } else {
      this.snackBar.dismiss();
      this.localStorageService.removeItem('activity-selection');
    }
  }

  openSnackBar(): void {
    this.snackBar
      .openFromComponent(SnackBarButtonsComponent, {
        horizontalPosition: 'end',
        data: {
          buttons: [
            {
              label: `Shrani v plezalni dnevnik (${this.selectedRoutes.length})`,
            },
          ],
        },
      })
      .onAction()
      .subscribe(() => this.addActivity());
  }

  addRoutesToLocalStorage(routes: Route[]) {
    this.localStorageService.setItem(
      'activity-selection',
      {
        crag: this.crag,
        routes: routes,
      },

      dayjs().add(1, 'day').toISOString()
    );
  }

  addActivity(): void {
    this.authService
      .guardedAction({
        message: 'Za uporabo plezalnega dnevnika se moraš prijaviti.',
      })
      .then((success) => {
        if (success) {
          this.addRoutesToLocalStorage(this.selectedRoutes);

          this.router.navigate([
            '/plezalni-dnevnik/vpis',
            { crag: this.crag.id },
          ]);
        } else {
          this.openSnackBar();
        }
      });
  }

  loadActivity(authenticated: boolean): void {
    if (!authenticated) {
      this.ascents = [];
      return;
    }

    this.myCragSummaryGQL
      .watch({ input: { cragId: this.crag.id } })
      .valueChanges.subscribe((result) => {
        this.loading = false;
        result.data?.myCragSummary.forEach((ascent) => {
          this.ascents[ascent.route.id] = ascent.ascentType;
        });
      });
  }

  expandRow(routeId: string): void {
    if (this.expandedRowId === routeId) {
      this.previousExpandedRowId = this.expandedRowId;
      this.expandedRowId = null;
    } else {
      this.previousExpandedRowId = this.expandedRowId;
      this.expandedRowId = routeId;
    }

    setTimeout(() => {
      /**
       * After the animation is finished, the previous row ID should be nulled.
       * This ensures that, if the user will click on the same (previous) row again, it will be rendered again and not just reused.
       * This should set the height for the animation properly.
       */
      this.previousExpandedRowId = null;
    }, 300);
  }

  onPreviewHeightEvent(height: number): void {
    this.expandedRowHeight = height;
    this.changeDetection.detectChanges();
  }

  // Preserve original property order, when using keyvalue pipe in template
  originalOrder = (a: KeyValue<any, any>, b: KeyValue<any, any>): number => {
    return 0;
  };
}
