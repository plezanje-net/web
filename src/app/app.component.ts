import { Component, OnInit } from '@angular/core';

import { AuthService } from '../app/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './auth/login/login.component';
import { Router } from '@angular/router';
import { LayoutService } from './services/layout.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'plezanje-net';

  constructor(
    private authService: AuthService, 
    private dialog: MatDialog, 
    private router: Router,
    private layoutService: LayoutService,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.authService.openLogin$.subscribe((req) => {

      if (!this.router.navigated) {
        this.router.navigate(['/']);
      }

      this.dialog.open(LoginComponent, {
        data: {
          message: req.message
        }
      }).afterClosed().subscribe((data) => {
        if (data != null && data != '' && req.returnUrl != null) {
          this.router.navigateByUrl(req.returnUrl);
        }
      });
    })

    this.layoutService.$breadcrumbs.subscribe((value) => {
      let title = "Plezanje.net";
      if (value.length > 0) {
        title = value[value.length - 1].name + " · " + title;
      }
      this.titleService.setTitle(title);
    })
  }
}
