import { Component, OnInit } from '@angular/core';

import { AuthService } from '../app/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './auth/login/login.component';
import { Router } from '@angular/router';
import { LayoutService } from './services/layout.service';
import { Title } from '@angular/platform-browser';

import { filter } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'plezanje-net';
  nowYear = new Date().getFullYear();

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private layoutService: LayoutService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser();

    this.authService.openLogin$.subscribe((req) => {
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

    this.layoutService.$breadcrumbs.subscribe((value) => {
      let title = 'Plezanje.net';
      if (value.length > 0) {
        title = value[value.length - 1].name + ' · ' + title;
      }
      this.titleService.setTitle(title);
    });
  }
}
