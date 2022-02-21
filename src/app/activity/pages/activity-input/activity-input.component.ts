import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/services/layout.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Crag, IceFall, Peak, Route } from 'src/generated/graphql';
import ActivitySelection from 'src/app/types/activity-selection.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-activity-input',
  templateUrl: './activity-input.component.html',
  styleUrls: ['./activity-input.component.scss'],
})
export class ActivityInputComponent implements OnInit {
  type: string = null;
  routes: Route[] = [];
  crag: Crag;
  peak: Peak;
  iceFall: IceFall;

  constructor(
    private layoutService: LayoutService,
    private localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ crag, peak, icefall }) => {
      if (crag != null) {
        this.initCrag(crag);
      }

      // TODO: init peak, init icefall
    });

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

  initCrag(cragId: string): void {
    const activitySelection: ActivitySelection =
      this.localStorageService.getItem('activity-selection');

    if (activitySelection && activitySelection.crag.id == cragId) {
      const { routes, crag } = activitySelection;
      this.routes = routes;
      this.crag = crag;
      this.type = 'crag';
    }
  }
}
