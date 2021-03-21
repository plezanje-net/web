import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/services/layout.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  loading = false;
  success = false;

  form = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required, Validators.minLength(8)]),
    firstname: new FormControl("", [Validators.required]),
    lastname: new FormControl("", [Validators.required]),
    conditions: new FormControl(false, [Validators.requiredTrue])
  })

  constructor(
    private layoutService: LayoutService,
    private apollo: Apollo,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.layoutService.$breadcrumbs.next([
      {
        name: "Registracija"
      }
    ])
  }

  register() {
    this.loading = true;

    const value = this.form.value;

    this.apollo.mutate({
      mutation: gql`
        mutation {
          register(input: {
            email: "${value.email}",
            password: "${value.password}",
            firstname: "${value.firstname}",
            lastname: "${value.lastname}"
          })
        }
      `
    }).subscribe(() => {
      this.success = true;
    }, (error) => {
      this.loading = false;

      let message = 'Registracija ni bila uspešna. Preverite vnešene podatke.';
      if (error.message != null && error.message == 'duplicate_entity_field') {
        message = 'Uporabniški račun za ta e-naslov že obstaja.';
      }

      this.snackbar.open(message, null, { panelClass: "error", duration: 3000 });
    })
  }

}
