import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataError } from 'src/app/types/data-error';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from 'src/app/services/layout.service';
import { Subject, Subscription, take } from 'rxjs';
import { Tab } from '../../types/tab';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CommentFormComponent } from 'src/app/shared/components/comment-form/comment-form.component';
import {
  CragBySlugGQL,
  CragBySlugQuery,
  Comment,
  Crag,
} from 'src/generated/graphql';
import { GraphQLError } from 'graphql';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-crag',
  templateUrl: './crag.component.html',
  styleUrls: ['./crag.component.scss'],
})
export class CragComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  error: DataError = null;

  canEdit: boolean = false;

  crag: CragBySlugQuery['cragBySlug'];

  warnings: CragBySlugQuery['cragBySlug']['comments'];

  map: any;

  action$ = new Subject<string>();

  tabs: Array<Tab> = [
    {
      slug: 'lokacija',
      label: 'Lokacija & dostop',
    },
    {
      slug: 'smeri',
      label: 'Smeri',
    },
    {
      slug: 'komentarji',
      label: 'Komentarji',
    },
    {
      slug: 'info',
      label: 'Info',
    },
    {
      slug: 'galerija',
      label: 'Galerija',
    },
  ];

  activeTab: string = 'smeri';

  cragSub: Subscription;
  subscriptions: Subscription[] = [];

  constructor(
    private layoutService: LayoutService,
    private authService: AuthService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cragBySlugGQL: CragBySlugGQL,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.layoutService.$breadcrumbs.next([
      {
        name: 'Plezališča',
      },
    ]);

    const routeSub = this.activatedRoute.params.subscribe((params) => {
      this.loading = true;

      if (this.cragSub != null) {
        this.cragSub.unsubscribe();
      }

      this.cragSub = this.cragBySlugGQL
        .watch({
          crag: params.crag,
        })
        .valueChanges.subscribe((result) => {
          this.loading = false;

          if (result.errors != null) {
            this.queryError(result.errors);
          } else {
            this.querySuccess(result.data.cragBySlug);
          }
        });

      if (params.tab != null) {
        this.activeTab = params.tab;
      } else {
        this.activeTab = 'smeri';
      }
    });
    this.subscriptions.push(routeSub);

    const actionsSub = this.action$.subscribe((action) => {
      switch (action) {
        case 'add-comment':
          this.addComment('comment');
          break;
        case 'add-condition':
          this.addComment('condition');
          break;
        case 'add-warning':
          this.addComment('warning');
          break;
      }
    });
    this.subscriptions.push(actionsSub);

    const authSub = this.authService.currentUser.subscribe(
      (user) => (this.canEdit = user != null && user.roles.includes('admin'))
    );
    this.subscriptions.push(authSub);

    const breakpointSub = this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.XSmall])
      .subscribe((res) => {
        if (!res.matches && this.activeTab == 'lokacija') {
          this.setActiveTab(this.tabs[1]);
        }
      });
    this.subscriptions.push(breakpointSub);
  }

  ngOnDestroy() {
    this.cragSub.unsubscribe();
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  queryError(errors: readonly GraphQLError[]) {
    if (errors.length > 0 && errors[0].message == 'entity_not_found') {
      this.error = {
        message: 'Plezališče ne obstaja v bazi.',
      };
      return;
    }

    this.error = {
      message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
    };
  }

  querySuccess(cragBySlug: CragBySlugQuery['cragBySlug']) {
    this.crag = cragBySlug;
    this.warnings = (this.crag as Crag).comments?.filter(
      (comment: Comment) => comment.type === 'warning'
    );

    if (this.router.url.includes('/alpinizem/stena')) {
      // TODO: define breadcrumbs
      // this.layoutService.$breadcrumbs.next([]);
    } else {
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
    }
  }

  setActiveTab(tab: Tab) {
    let routeParams: any[] = [
      '/plezalisca/',
      this.crag.country.slug,
      this.crag.slug,
    ];

    if (tab.slug != 'smeri') {
      routeParams.push({ tab: tab.slug });
    }

    this.router.navigate(routeParams);
  }

  addComment(type: string) {
    this.authService.guardedAction({}).then((success) => {
      if (success) {
        this.dialog.open(CommentFormComponent, {
          data: {
            crag: this.crag,
            type: type,
          },
          autoFocus: false,
        });
      }
    });
  }

  onImageClicked() {
    this.setActiveTab({
      slug: 'galerija',
      label: 'Galerija',
    });
  }
}
