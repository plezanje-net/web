import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['../login/login.component.scss'],
})
export class PasswordRecoveryComponent implements OnInit {
  loading = false;
  success = false;

  constructor(private apollo: Apollo, private snackbar: MatSnackBar) {}

  passwordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  ngOnInit(): void {}

  recover(): void {
    this.loading = true;

    const value = this.passwordForm.value;

    this.apollo
      .mutate({
        mutation: gql`
        mutation {
          recover(email: "${value.email}")
        }
      `,
      })
      .subscribe(
        () => {
          this.loading = false;
          this.success = true;
        },
        (error) => {
          this.loading = false;
          this.snackbar.open('Račun s tem e-naslovom ne obstaja.', null, {
            panelClass: 'error',
            duration: 3000,
          });
        }
      );
  }
}
