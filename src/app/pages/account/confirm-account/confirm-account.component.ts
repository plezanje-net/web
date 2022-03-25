import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

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
    private apollo: Apollo,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.apollo
        .mutate({
          mutation: gql`
          mutation {
            confirm(input: {
              id: "${params.id}", 
              token: "${params.token}"
            })
          }
        `,
        })
        .subscribe(
          () => {
            this.loading = false;
            this.success = true;
          },
          () => {
            this.loading = false;
            this.success = false;
          }
        );
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
