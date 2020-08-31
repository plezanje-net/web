import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../services/layout.service';

import { Breadcrumb } from '../../types/breadcrumb';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {

  constructor(private layoutService: LayoutService) { }

  breadcrumbs: Array<Breadcrumb> = [];

  ngOnInit(): void {
    this.layoutService.$breadcrumbs.subscribe(
      (breadcrumbs: Array<Breadcrumb>) => (this.breadcrumbs = breadcrumbs)
    );
  }
}
