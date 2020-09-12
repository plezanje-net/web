import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class PasswordRecoveryComponent implements OnInit {

  constructor() { }

  passwordForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email])
  })


  ngOnInit(): void {
  }

  recover(): void {
    console.log(this.passwordForm.value);
  }

}
