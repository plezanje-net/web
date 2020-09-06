import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/services/layout.service';
import { DataError } from '../../types/data-error';
import { ActivatedRoute } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { getLocaleExtraDayPeriodRules } from '@angular/common';

declare var ol: any;

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

  area: string;

  map: any;

  constructor(
    private layoutService: LayoutService,
    private activatedRoute: ActivatedRoute,
    private apollo: Apollo
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

      let cragsArgs = params.area != null ? `(area:"${params.area}")` : '';

      this.apollo.watchQuery({
        query: gql`
          {
            countryBySlug(slug: "${params.country}") {
              name,
              slug,
              code,
              crags${cragsArgs} {
                id,
                slug,
                name,
                nrRoutes,
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
      }).valueChanges.subscribe(result => {
        this.loading = false;
        this.cragsLoading = false;

        if (result.errors != null) {
          this.queryError(result.errors)
        } else {
          this.querySuccess(result.data);
        }
      })
    })

    this.map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([73.8567, 18.5204]),
        zoom: 8
      })
    });
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
}
