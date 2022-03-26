import { Component, OnDestroy, OnInit } from '@angular/core';

import { AuthService } from '../app/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './auth/login/login.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LayoutService } from './services/layout.service';

import { filter } from 'rxjs/operators';
import * as _ from 'lodash';
import { Subscription, take } from 'rxjs';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'plezanje-net';
  nowYear = new Date().getFullYear();

  subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private layoutService: LayoutService
  ) {}

  ngOnInit(): void {
    this.authService.initialize();

    const loginSub = this.authService.openLogin$.subscribe((req) => {
      if (!this.router.navigated) {
        this.router.navigate(['/']);
      }

      this.dialog
        .open(LoginComponent, {
          data: {
            message: req.message,
          },
        })
        .afterClosed()
        .pipe(
          take(1),
          filter((data) => {
            if (req.success != null && _.isNil(data)) {
              req.success.next(false);
            }
            return data != null && data != '';
          })
        )
        .subscribe((data) => {
          if (req.returnUrl != null) {
            this.router.navigateByUrl(req.returnUrl);
          }

          if (req.success != null) {
            req.success.next(data);
          }
        });
    });
    this.subscriptions.push(loginSub);

    // Fallback page title - if title should differentiate from breadcrumbs, the setTitle has to be called in corresponding component
    const breadcrumbsSub = this.layoutService.$breadcrumbs.subscribe((list) =>
      this.layoutService.setTitle(
        list.length > 0 ? list.slice(-1)[0].name : undefined
      )
    );
    this.subscriptions.push(breadcrumbsSub);

    const routerSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => gtag('event', 'page_view'));

    this.subscriptions.push(routerSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
