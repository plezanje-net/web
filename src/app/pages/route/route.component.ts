import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { DataError } from '../../types/data-error';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.scss']
})
export class RouteComponent implements OnInit {

  loading: boolean = true;
  error: DataError = null;
  route: any = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private apollo: Apollo,
    private layoutService: LayoutService,
  ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe((params: Params) => {
      this.apollo.watchQuery({
        query: gql`
          {
            route(id: "${params.route}") {
              id,
              difficulty,
              name,
              grade,
              length,
              author,
              status,
              sector {
                id,
                name
              },
              grades {
                grade,
                user {
                  firstname,
                  lastname
                },
                created,
                updated,
              },
              comments {
                type,
                user {
                  firstname,
                  lastname
                },
                content
              },
              images {
                path
              },
              sector {
                name
                crag {
                  name,
                  slug,
                  country {
                    slug,
                    name
                  }
                }
              }
            }
          }
        `
      }).valueChanges.subscribe(result => {
        this.loading = false;

        if (result.errors != null) {
          this.queryError(result.errors);
        } else {
          this.querySuccess(result.data);
        }
      });
    });
  }

  queryError(errors: any): void {
    if (errors.length > 0 && errors[0].message === 'entity_not_found') {
      this.error = {
        message: 'Smer ne obstaja v bazi.'
      };

      return;
    }

    this.error = {
      message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.'
    };
  }

  querySuccess(data: any): void {
    this.route = data.route;

    this.layoutService.$breadcrumbs.next([
      {
        name: 'Plezališča',
        path: '/plezalisca',
      },
      {
        name: this.route.sector.crag.country.name,
        path: '/plezalisca/' + this.route.sector.crag.country.slug,
      },
      {
        name: this.route.sector.crag.name,
        path: '/plezalisca/' + this.route.sector.crag.slug,
      },
      {
        name: this.route.name,
      },
    ]);
  }
}
