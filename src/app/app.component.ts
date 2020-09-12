import { Component, OnInit } from '@angular/core';

import { AuthService } from '../app/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './auth/login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'plezanje-net';

  constructor(private authService: AuthService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.authService.openLogin$.subscribe((req) => {
      this.dialog.open(LoginComponent, {
        data: {
          message: req.message
        }
      });
    })
  }
}
