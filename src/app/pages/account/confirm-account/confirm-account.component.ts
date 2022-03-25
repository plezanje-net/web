import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ConfirmGQL } from 'src/generated/graphql';

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.scss'],
})
export class ConfirmAccountComponent implements OnInit, OnDestroy {
  loading = true;
  success = false;

  subscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private confirmGQL: ConfirmGQL
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap((params) => {
          return this.confirmGQL.mutate({
            input: {
              id: params.id,
              token: params.token,
            },
          });
        })
      )
      .subscribe({
        next: () => {
          this.loading = false;
          this.success = true;
        },
        error: () => {
          this.loading = false;
          this.success = false;
        },
      });

    this.subscription = this.authService.currentUser.subscribe((user) => {
      // user just logged in, navigate to home
      if (user !== null) {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
