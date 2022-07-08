import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataError } from 'src/app/types/data-error';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from 'src/app/services/layout.service';
import { Subject, Subscription } from 'rxjs';
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
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { User } from '@sentry/angular';
import { ScrollService } from 'src/app/services/scroll.service';

@Component({
  selector: 'app-crag',
  templateUrl: './crag.component.html',
  styleUrls: ['./crag.component.scss'],
})
export class CragComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  error: DataError = null;

  crag: CragBySlugQuery['cragBySlug'];

  warnings: CragBySlugQuery['cragBySlug']['comments'];

  map: any;

  action$ = new Subject<string>();

  isPrivate = false;
  user: User;

  tabs: Array<Tab> = [
    {
      slug: 'info',
      label: 'Info',
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
      slug: 'galerija',
      label: 'Galerija',
    },
  ];

  activeTab: string = 'smeri';
  section: string;

  cragSub: Subscription;
  subscriptions: Subscription[] = [];

  constructor(
    private layoutService: LayoutService,
    private authService: AuthService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cragBySlugGQL: CragBySlugGQL,
    private breakpointObserver: BreakpointObserver,
    private scrollService: ScrollService
  ) {}

  ngOnInit(): void {
    // TODO: unsubscribe
    this.authService.currentUser.subscribe((user) => (this.user = user));
    this.section = this.router.url.includes('/alpinizem/stena')
      ? 'alpinism'
      : 'sport';

    this.layoutService.$breadcrumbs.next(
      this.section === 'alpinism'
        ? [
            { name: 'Alpinizem', path: '/alpinizem' },
            {
              name: 'Vrhovi',
              path: '/alpinizem/vrhovi/drzave',
            },
          ]
        : [
            {
              name: 'Plezališča',
            },
          ]
    );

    const routeSub = this.activatedRoute.params.subscribe((params) => {
      this.loading = true;

      if (this.cragSub != null) {
        this.cragSub.unsubscribe();
      }

      this.cragSub = this.cragBySlugGQL
        .watch({
          crag: params.crag,
        })
        .valueChanges.subscribe({
          next: (result) => {
            this.loading = false;
            this.querySuccess(result.data.cragBySlug);

            if (
              params.tab == 'info' &&
              !this.breakpointObserver.isMatched([
                Breakpoints.Small,
                Breakpoints.XSmall,
              ])
            ) {
              this.setActiveTab(this.tabs[1]);
            } else if (params.tab != null) {
              this.activeTab = params.tab;
            } else {
              this.activeTab = 'smeri';
            }
          },
          error: (error) => {
            this.loading = false;
            this.queryError(error);
          },
        });
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

    const breakpointSub = this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.XSmall])
      .subscribe((res) => {
        if (!res.matches && this.activeTab == 'info') {
          this.setActiveTab(this.tabs[1]);
        }
      });
    this.subscriptions.push(breakpointSub);
  }

  ngOnDestroy() {
    this.cragSub.unsubscribe();
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  queryError(error: Error) {
    if (error.message === 'entity_not_found') {
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

    if (this.section === 'alpinism') {
      this.layoutService.$breadcrumbs.next([
        {
          name: 'Alpinizem',
          path: '/alpinizem',
        },
        {
          name: 'Vrhovi',
          path: '/alpinizem/vrhovi/drzave',
        },
        {
          name: this.crag.country.name,
          path: '/alpinizem/vrhovi/drzava/' + this.crag.country.slug,
        },
        {
          name: this.crag.peak.name,
          path: '/alpinizem/vrhovi/vrh/' + this.crag.peak.slug,
        },
        {
          name: this.crag.name,
        },
      ]);
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

      this.layoutService.setTitle([
        `Plezališče ${this.crag.name}`,
        this.crag.country.name,
      ]);

      this.scrollService.restoreScroll();
    }
  }

  setActiveTab(tab: Tab) {
    this.router.navigate([tab.slug === 'smeri' ? {} : { tab: tab.slug }], {
      relativeTo: this.activatedRoute,
    });
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
