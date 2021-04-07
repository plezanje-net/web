import { Component, OnInit } from '@angular/core';
import { DataError } from 'src/app/types/data-error';
import { Apollo, gql } from 'apollo-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from 'src/app/services/layout.service';
import { Subject } from 'rxjs';

import { Tab } from '../../types/tab';
import { AuthService } from 'src/app/auth/auth.service';
import { Overlay } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { CommentFormComponent } from 'src/app/forms/comment-form/comment-form.component';

@Component({
  selector: 'app-crag',
  templateUrl: './crag.component.html',
  styleUrls: ['./crag.component.scss']
})
export class CragComponent implements OnInit {

  loading: boolean = true;
  error: DataError = null;

  crag: any;

  map: any;

  action$ = new Subject<string>();

  tabs: Array<Tab> = [
    {
      slug: 'lokacija',
      label: 'Lokacija & dostop'
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

  activeTab: string = "smeri";

  constructor(
    private layoutService: LayoutService,
    private authService: AuthService,
    private overlay: Overlay,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private apollo: Apollo,
    private router: Router
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
                },
                comments {
                  content,
                  created,
                  user {
                    fullName
                  }
                },
                conditions {
                  content,
                  created,
                  user {
                    fullName
                  }
                },
                warnings {
                  content,
                  created,
                  user {
                    fullName
                  }
                }
                images {
                  title,
                  path
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

      if (params.tab != null) {
        this.activeTab = params.tab;
      } else {
        this.activeTab = "smeri";
      }
    });

    this.action$.subscribe((action) => {
      switch (action) {
        case "add-comment":
          this.addComment("comment")
          break;
        case "add-condition":
          this.addComment("condition")
          break;
        case "add-warning":
          this.addComment("warning")
          break;
      }
    });
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

  setActiveTab(tab: Tab) {
    let routeParams = [
      "/plezalisca/",
      this.crag.country.slug,
      this.crag.slug
    ];

    if (tab.slug != 'smeri') {
      routeParams.push({ tab: tab.slug });
    }

    this.router.navigate(routeParams);
  }

  addComment(type: string) {
    this.authService
      .guardedAction({})
      .then(() => {
        this.dialog.open(CommentFormComponent, {
          data: {
            crag: this.crag,
            type: type,
          },
          autoFocus: false
        }).afterClosed().subscribe(() => {
          console.log("AOAOAOAO")
        })
      })
  }


}
