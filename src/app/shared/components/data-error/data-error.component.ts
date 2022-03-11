import { Component, OnInit, Input } from '@angular/core';
import { DataError } from 'src/app/types/data-error';

@Component({
  selector: 'app-data-error',
  templateUrl: './data-error.component.html',
  styleUrls: ['./data-error.component.scss'],
})
export class DataErrorComponent implements OnInit {
  @Input() error: DataError;

  constructor() {}

  ngOnInit(): void {}
}
