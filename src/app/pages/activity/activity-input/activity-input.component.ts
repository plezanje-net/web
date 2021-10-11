import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-activity-input',
  templateUrl: './activity-input.component.html',
  styleUrls: ['./activity-input.component.scss'],
})
export class ActivityInputComponent implements OnInit {
  routes: any;
  crag: any;

  constructor(private layoutService: LayoutService) {}

  ngOnInit(): void {
    if (localStorage.getItem('activity-selection')) {
      const { routes, crag } = JSON.parse(localStorage.getItem('activity-selection'));
      this.routes = routes;
      this.crag = crag;
    }

    this.layoutService.$breadcrumbs.next([{
      name: 'Plezalni dnevnik',
      path: '/plezalni-dnevnik',
    }, {
      name: 'Vpis',
      path: '/plezalni-dnevnik/vpis',
    }]);
  }
}
