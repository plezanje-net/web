import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { DataError } from 'src/app/types/data-error';

@Component({
  selector: 'app-popular-crags',
  templateUrl: './popular-crags.component.html',
  styleUrls: ['./popular-crags.component.scss'],
})
export class PopularCragsComponent implements OnInit {
  constructor() {}

  error: DataError = null;

  oneWeekAgo: string;
  oneMonthAgo: string;

  ngOnInit(): void {
    this.oneWeekAgo = moment()
      .subtract(1, 'week')
      // .subtract({ years: 1, months: 3 }) // TEST: test it
      .format('YYYY-MM-DD');

    this.oneMonthAgo = moment()
      .subtract(1, 'month')
      // .subtract({ years: 1, months: 3 }) // TEST: test it
      .format('YYYY-MM-DD');
  }

  handleError(error: DataError) {
    this.error = error;
  }
}
