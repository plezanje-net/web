import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import dayjs from 'dayjs';
import { DataError } from 'src/app/types/data-error';

@Component({
  selector: 'app-popular-crags',
  templateUrl: './popular-crags.component.html',
  styleUrls: ['./popular-crags.component.scss'],
})
export class PopularCragsComponent implements OnInit {
  constructor() {}

  @Output() errorEvent = new EventEmitter<DataError>();

  oneWeekAgo: string;
  oneMonthAgo: string;

  ngOnInit(): void {
    this.oneWeekAgo = dayjs().subtract(1, 'week').format('YYYY-MM-DD');
    this.oneMonthAgo = dayjs().subtract(1, 'month').format('YYYY-MM-DD');
  }

  handleError(error: DataError) {
    this.errorEvent.emit(error);
  }
}
