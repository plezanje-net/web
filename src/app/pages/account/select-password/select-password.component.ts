import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { LayoutService } from 'src/app/services/layout.service';
import { SetPasswordGQL } from 'src/generated/graphql';

@Component({
  selector: 'app-select-password',
  templateUrl: './select-password.component.html',
  styleUrls: ['./select-password.component.scss'],
})
export class SelectPasswordComponent implements OnInit, OnDestroy {
  loading = false;
  success = false;

  form = new FormGroup({
    id: new FormControl(''),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    token: new FormControl(''),
  });

  subscription: Subscription;

  constructor(
    private layoutService: LayoutService,
    private snackbar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private setPasswordGQL: SetPasswordGQL
  ) {}

  ngOnInit(): void {
    this.layoutService.$breadcrumbs.next([
      {
        name: 'Menjava gesla',
      },
    ]);

    this.activatedRoute.params.subscribe((params) => {
      this.form.patchValue(params);
    });

    this.subscription = this.authService.currentUser.subscribe((user) => {
      // user just logged in, navigate to home
      if (user !== null) {
        this.router.navigate(['/']);
      }
    });
  }

  changePassword() {
    this.loading = true;

    const value = this.form.value;

    this.setPasswordGQL
      .mutate({
        input: { id: value.id, token: value.token, password: value.password },
      })
      .subscribe({
        next: () => {
          this.success = true;
        },
        error: () => {
          this.loading = false;

          let message =
            'Novega gesla ni bilo mogoče shraniti. Poskusite ga resetirati ponovno.';
          this.snackbar.open(message, null, {
            panelClass: 'error',
            duration: 3000,
          });
        },
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
