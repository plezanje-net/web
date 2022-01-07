import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public naviOpen: boolean = false;

  authSub: Subscription;
  loggedIn = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.authSub = this.authService.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        this.loggedIn = isAuthenticated;
      }
    );

    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.naviOpen = false;
      }
    });
  }

  toggleNavi(): void {
    this.naviOpen = !this.naviOpen;
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/']); // TODO: should only navigate to home if route currently on is protected
      this.snackbar.open('Uspešno ste se odjavili', null, { duration: 3000 }); // TODO: discuss about tiking or viking in messages :)
    });
  }

  login() {
    this.authService.openLogin$.next({
      message:
        'Prijavite se za pregled svojega dnevnika ali oddajanje komentarjev.', // TODO: pimp message
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
}
