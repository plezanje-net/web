import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/services/layout.service';
import { DataError } from '../../types/data-error';
import { ActivatedRoute } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CragFormComponent } from 'src/app/forms/crag-form/crag-form.component';

declare var ol: any;

const CragsQuery = gql`
  query CragsQuery($country: String!, $area: String) {
    countryBySlug(slug: $country) {
      id,
      name,
      slug,
      code,
      crags(area: $area) {
        id,
        slug,
        name,
        nrRoutes,
        orientation,
        long,
        lat,
        minGrade,
        maxGrade
      },
      areas {
        id,
        name
      }
    }
  }
`

@Component({
  selector: 'app-crags',
  templateUrl: './crags.component.html',
  styleUrls: ['./crags.component.scss']
})

export class CragsComponent implements OnInit {

  loading: boolean = true;
  cragsLoading: boolean = false;
  error: DataError = null;

  countries: any[];
  country: any;

  crags$ = new BehaviorSubject<any[]>([]);

  area: string;

  map: any;

  constructor(
    private layoutService: LayoutService,
    private activatedRoute: ActivatedRoute,
    private apollo: Apollo,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {

    this.layoutService.$breadcrumbs.next([
      {
        name: "Plezališča"
      }
    ])

    this.loading = true;

    this.activatedRoute.params.subscribe((params) => {

      this.cragsLoading = true;
      this.area = params.area;

      this.apollo.query({
        query: CragsQuery,
        variables: {
          country: params.country,
          area: params.area
        }
      }).subscribe(result => {
        this.loading = false;
        this.cragsLoading = false;

        if (result.errors != null) {
          this.queryError(result.errors)
        } else {
          this.querySuccess(result.data);
        }
      })
    })
  }

  queryError(errors: any) {
    if (errors.length > 0 && errors[0].message == 'entity_not_found') {
      this.error = {
        message: 'Država ne obstaja v bazi.'
      }
      return;
    }

    this.error = {
      message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.'
    }
  }

  querySuccess(data: any) {
    this.country = data.countryBySlug;

    this.crags$.next(this.country.crags);

    this.layoutService.$breadcrumbs.next([
      {
        name: "Plezališča",
        path: "/plezalisca"
      },
      {
        name: this.country.name
      }
    ])
  }

  addCrag() {
    this.dialog.open(CragFormComponent, {
      data: {
        countryId: this.country.id
      }
    }).afterClosed().subscribe((data) => {
      console.log(data);
    });
  }
}
