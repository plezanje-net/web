import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { PasswordRecoveryComponent } from '../password-recovery/password-recovery.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<LoginComponent>,
    private dialog: MatDialog
  ) { }

  loginForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required]),
    remember: new FormControl(false)
  })

  ngOnInit(): void { }

  passwordRecovery(): boolean {
    this.dialog.open(PasswordRecoveryComponent);
    this.dialogRef.close();

    return false;
  }

  login(): void {
    console.log(this.loginForm.value);
  }

}
