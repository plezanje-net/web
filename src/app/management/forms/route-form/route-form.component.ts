import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Route } from 'src/generated/graphql';

@Component({
  selector: 'app-route-form',
  templateUrl: './route-form.component.html',
  styleUrls: ['./route-form.component.scss'],
})
export class RouteFormComponent implements OnInit {
  @Input() route: Route;

  form = new FormGroup({
    name: new FormControl(),
    grade: new FormControl(),
  });

  constructor() {}

  ngOnInit(): void {
    this.form.patchValue(this.route);
  }
}
