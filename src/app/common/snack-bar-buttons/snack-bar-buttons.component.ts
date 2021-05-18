import { Component, Inject, OnInit } from '@angular/core';
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';

export interface SnackBarData {
  buttons: any[];
}

@Component({
  selector: 'app-snack-bar-buttons',
  templateUrl: './snack-bar-buttons.component.html',
  styleUrls: ['./snack-bar-buttons.component.scss'],
})
export class SnackBarButtonsComponent implements OnInit {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackBarData,
    public snackBarRef: MatSnackBarRef<SnackBarButtonsComponent>
  ) {}

  ngOnInit(): void {}
}
