import { PageEvent } from '@angular/material/paginator';
import { Params } from '@angular/router';
import moment from 'moment';
import { Subject } from 'rxjs';

export interface ColumnDefinition {
  name: string;
  type?: string;
  label: string;
  sortable?: boolean;
  defaultSort?: string;
}

export interface FilterDefinition {
  name?: string;
  type?: string;
}

export class FilteredTable {
  navigate$ = new Subject<any>();

  columns: ColumnDefinition[];
  filters: FilterDefinition[];

  queryParams: any = {};
  routeParams: any = {};
  filterParams: any = {};

  sortColumn: string;
  sortDirection: string;

  constructor(columns: ColumnDefinition[], filters: FilterDefinition[]) {
    this.columns = columns.map((column) => {
      return {
        ...column,
        sortable: column.sortable != null,
      };
    });

    const sortCol = this.columns.find((col) => col.defaultSort != null);

    if (sortCol) {
      this.sortColumn = sortCol.name;
      this.sortDirection = sortCol.defaultSort;
    }

    this.filters = filters;
  }

  initialized = false;

  setRouteParams(values: Params) {
    const qp: any = {};
    const fp: any = {};

    this.routeParams = { ...values };

    this.filters.forEach((filter) => {
      if (filter.type == 'date' && values[filter.name] != null) {
        fp[filter.name] = moment(values[filter.name]);
        qp[filter.name] = values[filter.name];
      }
      if (filter.type == 'multiselect' && values[filter.name] != null) {
        fp[filter.name] = values[filter.name].split(',');
        qp[filter.name] = values[filter.name].split(',');
      }
    });

    if (values.pageNumber != null) {
      qp.pageNumber = parseInt(values.pageNumber);
    }

    if (values.sort != null) {
      const sortCol = values.sort.split(',');
      this.sortColumn = sortCol[0];
      this.sortDirection = sortCol[1];
    }

    qp.orderBy = {
      field: this.sortColumn,
      direction: this.sortDirection,
    };

    if (this.initialized) {
      this.setFilterParams(fp);
    } else {
      this.filterParams = fp;
      this.initialized = true;
    }

    this.queryParams = qp;
  }

  setFilterParams(values: any) {
    const rp: any = {};
    const fp: any = {};

    this.filters.forEach((filter) => {
      if (filter.type == 'date' && values[filter.name] != null) {
        rp[filter.name] = moment(values[filter.name]).format('YYYY-MM-DD');
        fp[filter.name] = values[filter.name];
      }
      if (
        filter.type == 'multiselect' &&
        values[filter.name] != null &&
        values[filter.name].length > 0 &&
        values[filter.name] != ''
      ) {
        rp[filter.name] = values[filter.name].join(',');
        fp[filter.name] = values[filter.name];
      }
    });

    if (JSON.stringify(this.filterParams) != JSON.stringify(fp)) {
      this.routeParams.pageNumber = 1;
    }

    this.filterParams = fp;

    if (
      this.routeParams.pageNumber != null &&
      this.routeParams.pageNumber != 1
    ) {
      rp.pageNumber = this.routeParams.pageNumber;
    }

    const defaultSortCol = this.columns.find((col) => col.defaultSort != null);
    if (
      defaultSortCol == null ||
      defaultSortCol.name != this.sortColumn ||
      defaultSortCol.defaultSort != this.sortDirection
    ) {
      rp.sort = this.routeParams.sort;
    }

    this.navigate$.next(rp);
  }

  paginate(event: PageEvent) {
    this.routeParams.pageNumber = event.pageIndex + 1;

    this.navigate$.next(this.routeParams);
  }

  sort(column: ColumnDefinition) {
    if (this.sortColumn == column.name) {
      this.sortDirection = this.sortDirection == 'DESC' ? 'ASC' : 'DESC';
    } else {
      this.sortDirection = 'DESC';
    }

    this.sortColumn = column.name;

    this.routeParams.sort = this.sortColumn + ',' + this.sortDirection;

    this.navigate$.next(this.routeParams);
  }
}
