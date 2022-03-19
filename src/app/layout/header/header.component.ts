import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from '../../../generated/graphql';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public naviOpen: boolean = false;

  subscriptions: Subscription[] = [];
  user: User;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const naviSub = this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.naviOpen = false;
      }
    });
    this.subscriptions.push(naviSub);

    const authSub = this.authService.currentUser.subscribe(
      (user) => (this.user = user)
    );
    this.subscriptions.push(authSub);
  }

  toggleNavi(): void {
    this.naviOpen = !this.naviOpen;
  }

  async logout() {
    await this.authService.logout();
    this.snackbar.open('Uspešno si se odjavil', null, { duration: 3000 });
    this.router.navigate(['/']);
  }

  login() {
    this.authService.openLogin$.next({
      message:
        'Prijavi se za pregled svojega dnevnika ali oddajanje komentarjev.',
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
