import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
export interface DialogData {
  routeId: string;
  routeName: string;
}
import { QueryRef } from 'apollo-angular';
import {
  Subscription,
  take,
} from 'rxjs';
import { DataError } from 'src/app/types/data-error';;
import {
  ASCENT_TYPES,
  PUBLISH_OPTIONS,
} from 'src/app/common/activity.constants';
import {
  FindActivityRoutesInput,
  MyActivityRoutesQuery,
  MyActivityRoutesGQL
} from 'src/generated/graphql';
import { FilteredTable } from '../../../common/filtered-table';

@Component({
  selector: 'crag-activity-route',
  templateUrl: './crag-activity-route.component.html',
  styleUrls: ['./crag-activity-route.component.scss'],
})
export class CragActivityRouteComponent {
  routeId: string;
  routeName: string
  error: DataError = null;

  routes: MyActivityRoutesQuery['myActivityRoutes']['items'];
  pagination: MyActivityRoutesQuery['myActivityRoutes']['meta'];

  filteredTable = new FilteredTable(
    [
      { name: 'date', label: 'Datum', defaultSort: 'DESC' },
      { name: 'crag', label: 'Plezališče' },
      { name: 'route', label: 'Smer' },
      { name: 'grade', label: 'Ocena' },
      { name: 'ascentType', label: 'Vrsta vzpona' },
      { name: 'notes', label: 'Opombe' },
      { name: 'publish', label: 'Vidnost' },
    ],
    [
      { name: 'dateFrom', type: 'date' },
      { name: 'dateTo', type: 'date' },
      { name: 'ascentType', type: 'multiselect' },
      { name: 'publish', type: 'multiselect' },
      { name: 'cragId', type: 'relation' },
      { name: 'routeId', type: 'relation' },
    ]
  );

  subscriptions: Subscription[] = [];
  ignoreFormChange = true;

  loading = false;

  ascentTypes = ASCENT_TYPES;
  publishOptions = PUBLISH_OPTIONS;
  noTopropeOnPage = false;


  activityRouteQuery: QueryRef<any>;
  activityRouteSub: Subscription;

  constructor(
    public dialogRef: MatDialogRef<CragActivityRouteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private myActivityRoutesGQL: MyActivityRoutesGQL
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    const ft = this.filteredTable;
    ft.setRouteParams({routeId: this.data.routeId, orderBy: {field: "date", direction: "DESC"}});
    const navSub = ft.navigate$.subscribe((params) => {
      this.myActivityRoutesGQL
        .fetch({input: params})
        .pipe(take(1))
        .subscribe((result) => {
          this.loading = false;
          ft.navigating = false;
          this.querySuccess(result.data.myActivityRoutes);
          });
      }
    );

    this.subscriptions.push(navSub);
    
    const queryParams: FindActivityRoutesInput = ft.queryParams;
    this.myActivityRoutesGQL.watch({ input: queryParams });

    if (this.activityRouteSub != null) {
      this.activityRouteSub.unsubscribe();
    }

    this.loading = true;
    this.activityRouteQuery = this.myActivityRoutesGQL.watch({ input: queryParams });

    this.activityRouteSub = this.activityRouteQuery.valueChanges.subscribe({
      next: (result) => {
        this.loading = false;
        ft.navigating = false;
        this.querySuccess(result.data.myActivityRoutes);
      },
      error: () => {
        this.loading = false;
        this.queryError();
      }
    });

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  queryError(): void {
    this.error = {
      message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
    };
  }

  querySuccess(data: MyActivityRoutesQuery['myActivityRoutes']): void {
    this.routes = data.items;
    this.pagination = data.meta;
    this.noTopropeOnPage = !this.routes.some(
      (route) =>
        this.ascentTypes.find((at) => at.value === route.ascentType).topRope
    );
  }


}


