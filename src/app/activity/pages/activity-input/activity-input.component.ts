import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/services/layout.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Crag, Route } from 'src/generated/graphql';
import ActivitySelection from 'src/app/types/activity-selection.interface';

@Component({
  selector: 'app-activity-input',
  templateUrl: './activity-input.component.html',
  styleUrls: ['./activity-input.component.scss'],
})
export class ActivityInputComponent implements OnInit {
  routes: Route[] = [];
  crag: Crag;

  constructor(
    private layoutService: LayoutService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    if (this.localStorageService.getItem('activity-selection')) {
      const { routes, crag }: ActivitySelection =
        this.localStorageService.getItem('activity-selection');

      this.routes = routes;
      this.crag = crag;
    }

    this.layoutService.$breadcrumbs.next([
      {
        name: 'Plezalni dnevnik',
        path: '/plezalni-dnevnik',
      },
      {
        name: 'Vpis',
      },
    ]);
  }
}
