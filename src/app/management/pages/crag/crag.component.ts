import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { LayoutService } from 'src/app/services/layout.service';
import {
  ManagementGetCragGQL,
  ManagementGetCragQuery,
} from 'src/generated/graphql';

@Component({
  selector: 'app-crag',
  templateUrl: './crag.component.html',
  styleUrls: ['./crag.component.scss'],
})
export class CragComponent implements OnInit {
  loading: boolean = true;
  crag: ManagementGetCragQuery['crag'];

  heading: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private managementGetCragGQL: ManagementGetCragGQL
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params.id != null) {
        this.managementGetCragGQL
          .fetch({
            id: params.id,
          })
          .pipe(take(1))
          .subscribe((result) => {
            this.crag = result.data.crag;

            this.layoutService.$breadcrumbs.next([
              {
                name: 'Plezališča',
                path: '/plezalisca',
              },
              {
                name: this.crag.country.name,
                path: '/plezalisca/' + this.crag.country.slug,
              },
              {
                name: this.crag.name,
              },
            ]);

            this.heading = `Urejanje plezališča - ${this.crag.name}`;
            this.loading = false;
          });
      } else {
        this.layoutService.$breadcrumbs.next([
          {
            name: 'Dodajanje plezališča',
          },
        ]);
        this.heading = `Dodajanje plezališča`;
        this.loading = false;
      }
    });
  }
}
