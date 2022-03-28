import { PageEvent } from '@angular/material/paginator';
import { Params } from '@angular/router';
import dayjs from 'dayjs';
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
  navigating = false;

  initialized = false;

  columns: ColumnDefinition[];
  filters: FilterDefinition[];

  queryParams: any = {};
  routeParams: any = {};
  filterParams: any = {};

  sortColumn: string;
  sortDirection: string;
  defaultSortColumn: string;
  defaultSortDirection: string;

  constructor(columns: ColumnDefinition[], filters: FilterDefinition[]) {
    this.columns = columns.map((column) => {
      return {
        ...column,
        sortable: column.sortable != null,
      };
    });

    const sortCol = this.columns.find((col) => col.defaultSort != null);

    if (sortCol) {
      this.defaultSortColumn = this.sortColumn = sortCol.name;
      this.defaultSortDirection = this.sortDirection = sortCol.defaultSort;
    }

    this.filters = filters;
  }

  setRouteParams(values: Params) {
    const qp: any = {};
    const fp: any = {};

    this.routeParams = { ...values };

    this.filters.forEach((filter) => {
      if (filter.type == 'date' && values[filter.name] != null) {
        fp[filter.name] = dayjs(values[filter.name]).format('YYYY-MM-DD');
        qp[filter.name] = values[filter.name];
        return;
      }
      if (filter.type == 'multiselect' && values[filter.name] != null) {
        fp[filter.name] = values[filter.name].split(',');
        qp[filter.name] = values[filter.name].split(',');
        return;
      }
      if (filter.type == 'relation' && values[filter.name] != null) {
        fp[filter.name] = values[filter.name];
        qp[filter.name] = values[filter.name];
        return;
      }
      fp[filter.name] = null;
    });

    if (values.pageNumber != null) {
      qp.pageNumber = parseInt(values.pageNumber);
    }

    if (values.sort != null) {
      // sort field was passed, use it to sort
      const sortCol = values.sort.split(',');
      this.sortColumn = sortCol[0];
      this.sortDirection = sortCol[1];
    } else {
      // sort field was not passed, but we might have a default sort set
      if (this.defaultSortColumn && this.defaultSortDirection) {
        // use default sort that was set in filteredTable constructor
        this.sortColumn = this.defaultSortColumn;
        this.sortDirection = this.defaultSortDirection;
      } else {
        // we dont't have a default sort, so unset the sort
        this.sortColumn = this.sortDirection = null;
      }
    }

    if (this.sortColumn && this.sortDirection) {
      qp.orderBy = {
        field: this.sortColumn,
        direction: this.sortDirection,
      };
    }

    this.setFilterParams(fp, false);

    this.queryParams = qp;
  }

  setFilterParams(values: any, navigate = true) {
    const rp: any = {};
    const fp: any = {};

    this.filters.forEach((filter) => {
      if (filter.type == 'date' && values[filter.name] != null) {
        rp[filter.name] = dayjs(values[filter.name]).format('YYYY-MM-DD');
        fp[filter.name] = values[filter.name];
        return;
      }
      if (
        filter.type == 'multiselect' &&
        values[filter.name] != null &&
        values[filter.name].length > 0 &&
        values[filter.name] != ''
      ) {
        rp[filter.name] = values[filter.name].join(',');
        fp[filter.name] = values[filter.name];
        return;
      }
      if (filter.type == 'relation' && values[filter.name] != null) {
        rp[filter.name] = values[filter.name];
        fp[filter.name] = values[filter.name];
        return;
      }
      fp[filter.name] = null;
    });

    if (
      this.initialized &&
      JSON.stringify(this.filterParams) != JSON.stringify(fp)
    ) {
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

    if (navigate) {
      this.navigate(rp);
    }
    this.initialized = true;
  }

  paginate(event: PageEvent) {
    this.routeParams.pageNumber = event.pageIndex + 1;

    this.navigate(this.routeParams);
  }

  sort(column: ColumnDefinition) {
    if (this.sortColumn == column.name) {
      this.sortDirection = this.sortDirection == 'DESC' ? 'ASC' : 'DESC';
    } else {
      this.sortDirection = 'DESC';
    }

    this.sortColumn = column.name;

    this.routeParams.sort = this.sortColumn + ',' + this.sortDirection;

    this.navigate(this.routeParams);
  }

  navigate(routeParams: any) {
    this.navigating = true;
    this.navigate$.next(routeParams);
  }
}
