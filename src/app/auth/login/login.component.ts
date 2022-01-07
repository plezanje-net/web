import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Apollo, gql } from 'apollo-angular';
import { AuthService } from '../auth.service';
import { PasswordRecoveryComponent } from '../password-recovery/password-recovery.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loading = false;

  constructor(
    private authService: AuthService,
    private dialogRef: MatDialogRef<LoginComponent>,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private apollo: Apollo,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      message: string;
    }
  ) {}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    remember: new FormControl(false),
  });

  ngOnInit(): void {}

  passwordRecovery(): boolean {
    this.dialog.open(PasswordRecoveryComponent);
    this.dialogRef.close();

    return false;
  }

  login(): void {
    this.loading = true;

    const value = this.loginForm.value;

    this.apollo
      .mutate({
        mutation: gql`
        mutation {
          login(input: {
            email: "${value.email}", 
            password: "${value.password}"
          }) {
            token
          }
        }
      `,
      })
      .subscribe(
        (result: any) => {
          this.authService
            .login(result.data.login.token)
            .then(() => this.dialogRef.close(true));
        },
        (error) => {
          this.loading = false;
          this.snackbar.open('Prijava ni uspela.', null, {
            panelClass: 'error',
            duration: 3000,
          });
        }
      );
  }
}
