import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataError } from '../../types/data-error';
import { LayoutService } from '../../services/layout.service';
import {
  Comment,
  Route,
  RouteBySlugGQL,
  RouteBySlugQuery,
} from 'src/generated/graphql';
import { Subject, Subscription, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CommentFormComponent } from 'src/app/shared/components/comment-form/comment-form.component';
import { GradingSystemsService } from 'src/app/shared/services/grading-systems.service';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.scss'],
})
export class RouteComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  error: DataError = null;
  route: Route;
  warnings: Comment[];

  section: string;

  action$ = new Subject<string>();
  actionSubscription: Subscription;
  routeQuerySubscription: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private authService: AuthService,
    private dialog: MatDialog,
    private routeBySlugGQL: RouteBySlugGQL,
    private gradingSystemService: GradingSystemsService
  ) {}

  ngOnInit(): void {
    this.section = this.router.url.includes('/alpinizem/stena')
      ? 'alpinism'
      : 'sport';

    this.routeQuerySubscription = this.activatedRoute.params
      .pipe(
        switchMap((params) => {
          return this.routeBySlugGQL.watch({
            cragSlug: params.crag,
            routeSlug: params.route,
          }).valueChanges;
        })
      )
      .subscribe({
        next: (result) => {
          this.loading = false;
          this.querySuccess(result.data);
        },
        error: (error) => {
          this.loading = false;
          this.queryError(error);
        },
      });

    this.actionSubscription = this.action$.subscribe((action) => {
      switch (action) {
        case 'add-comment':
          this.addComment('comment');
          break;
        case 'add-condition':
          this.addComment('condition');
          break;
        case 'add-description':
          this.addComment('description');
          break;
      }
    });
  }

  addComment(type: string) {
    this.authService.guardedAction({}).then((success) => {
      if (success) {
        this.dialog.open(CommentFormComponent, {
          data: {
            route: this.route,
            type,
          },
          autoFocus: false,
        });
      }
    });
  }

  queryError(error: Error): void {
    if (error.message === 'entity_not_found') {
      this.error = {
        message: 'Smer ne obstaja v bazi.',
      };
      return;
    }

    this.error = {
      message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
    };
  }

  querySuccess(data: RouteBySlugQuery): void {
    this.route = <Route>data.routeBySlug;
    this.warnings = this.route?.comments.filter(
      (comment) => comment.type === 'warning'
    );

    if (this.section === 'alpinism') {
      this.layoutService.$breadcrumbs.next([
        {
          name: 'Alpinizem',
          path: '/alpinizem',
        },
        {
          name: 'Vrhovi',
          path: '/alpinizem/vrhovi',
        },
        {
          name: this.route.sector.crag.country.name,
          path: `/alpinizem/vrhovi/${this.route.sector.crag.country.slug}`,
        },
        {
          name: this.route.sector.crag.peak.name,
          path: `/alpinizem/vrhovi/vrh/${this.route.sector.crag.peak.slug}`,
        },
        {
          name: this.route.sector.crag.name,
          path: `/alpinizem/stena/${this.route.sector.crag.slug}`,
        },
        {
          name: this.route.name,
        },
      ]);
    } else {
      this.layoutService.$breadcrumbs.next([
        {
          name: 'Plezališča',
          path: '/plezalisca',
        },
        {
          name: this.route.sector.crag.country.name,
          path: `/plezalisca/${this.route.sector.crag.country.slug}`,
        },
        {
          name: this.route.sector.crag.name,
          path: `/plezalisce/${this.route.sector.crag.slug}`,
        },
        {
          name: this.route.name,
        },
      ]);

      this.layoutService.setTitle([
        this.route.name,
        `Smer v plezališču ${this.route.sector.crag.name}`,
      ]);

      this.gradingSystemService
        .diffToGrade(this.route.difficulty, this.route.defaultGradingSystem.id)
        .then((grade) => {
          this.layoutService.setDescription(
            `${this.route.name}; Plezališče ${this.route.sector.crag.name}; Težavnost: ${grade.name}; Dolžina: ${this.route.length}`
          );
        });
    }
  }

  ngOnDestroy(): void {
    this.routeQuerySubscription.unsubscribe();
    this.actionSubscription.unsubscribe();
  }
}
