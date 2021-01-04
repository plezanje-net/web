import { Component, OnInit } from '@angular/core';
import { DataError } from 'src/app/types/data-error';
import { Apollo, gql } from 'apollo-angular';
import { ActivatedRoute } from '@angular/router';
import { LayoutService } from 'src/app/services/layout.service';
import { BehaviorSubject } from 'rxjs';

import { Tab } from '../../types/tab';

@Component({
  selector: 'app-crag',
  templateUrl: './crag.component.html',
  styleUrls: ['./crag.component.scss']
})
export class CragComponent implements OnInit {

  loading: boolean = true;
  error: DataError = null;

  crag: any;
  crags$ = new BehaviorSubject<any>([]);

  map: any;

  tabs: Array<Tab> = [
    {
      slug: 'lokacija',
      label: 'Lokacija'
    },
    {
      slug: 'smeri',
      label: 'Smeri'
    },
    {
      slug: 'komentarji',
      label: 'Komentarji'
    },
    {
      slug: 'info',
      label: 'Info'
    },
    {
      slug: 'galerija',
      label: 'Galerija'
    }
  ];

  activeTab: Tab = this.tabs[1];

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

    this.activatedRoute.params.subscribe((params) => {

      this.loading = true;

      this.apollo.watchQuery({
        query: gql`
          {
            cragBySlug(slug: "${params.crag}") {
                id,
                slug,
                name,
                lat,
                lon,
                access,
                description,
                area {
                  name
                },
                country {
                  id,
                  name,
                  slug
                },
                sectors {
                  id,
                  name,
                  label,
                  routes {
                    id,
                    name,
                    grade,
                    length
                  }
                }
              }
          }
        `
      }).valueChanges.subscribe(result => {
        this.loading = false;

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
        message: 'Plezališče ne obstaja v bazi.'
      }
      return;
    }

    this.error = {
      message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.'
    }
  }

  querySuccess(data: any) {
    this.crag = data.cragBySlug;

    this.crags$.next([this.crag]);

    this.layoutService.$breadcrumbs.next([
      {
        name: "Plezališča",
        path: "/plezalisca"
      },
      {
        name: this.crag.country.name,
        path: "/plezalisca/" + this.crag.country.slug
      },
      {
        name: this.crag.name
      }
    ])
  }

  setActiveTab(tab: Tab){
    this.activeTab = tab;
  }


}
