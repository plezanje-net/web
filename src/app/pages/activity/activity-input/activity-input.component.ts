import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-activity-input',
  templateUrl: './activity-input.component.html',
  styleUrls: ['./activity-input.component.scss'],
})
export class ActivityInputComponent implements OnInit {
  routes: any;
  crag: any;

  constructor() { }

  ngOnInit(): void {
    if (localStorage.getItem('activity-selection')) {
      const { routes, crag } = JSON.parse(localStorage.getItem('activity-selection'));
      this.routes = routes;
      this.crag = crag;
    }
  }
}
