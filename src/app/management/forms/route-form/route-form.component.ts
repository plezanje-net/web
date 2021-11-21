import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Registry } from 'src/app/types/registry';
import { Route } from 'src/generated/graphql';

@Component({
  selector: 'app-route-form',
  templateUrl: './route-form.component.html',
  styleUrls: ['./route-form.component.scss'],
})
export class RouteFormComponent implements OnInit {
  @Input('route') form: FormGroup;

  typeOptions: Registry[] = [
    { value: 'sport', label: 'Športna' },
    { value: 'multipitch', label: 'Večraztežajna' },
    { value: 'boulder', label: 'Balvan' },
  ];

  constructor() {}

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => {
      console.log(this.form.value);
    });
  }
}
