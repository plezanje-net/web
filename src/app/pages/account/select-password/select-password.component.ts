import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-select-password',
  templateUrl: './select-password.component.html',
  styleUrls: ['./select-password.component.scss']
})
export class SelectPasswordComponent implements OnInit {

  loading = false;
  success = false;

  form = new FormGroup({
    id: new FormControl(""),
    password: new FormControl("", [Validators.required, Validators.minLength(8)]),
    token: new FormControl("")
  })

  constructor(
    private layoutService: LayoutService,
    private apollo: Apollo,
    private snackbar: MatSnackBar,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.layoutService.$breadcrumbs.next([
      {
        name: "Menjava gesla"
      }
    ])

    this.activatedRoute.params.subscribe((params) => {
      this.form.patchValue(params);
    })
  }

  changePassword() {
    this.loading = true;

    const value = this.form.value;

    this.apollo.mutate({
      mutation: gql`
        mutation {
          setPassword(input: {
            id: "${value.id}", 
            token: "${value.token}", 
            password: "${value.password}"
          })
        }
      `
    }).subscribe(() => {
      this.success = true;
    }, (error) => {
      this.loading = false;

      let message = 'Novega gesla ni bilo mogoče shraniti. Poskusite ga resetirati ponovno.';
      this.snackbar.open(message, null, { panelClass: "error", duration: 3000 });
    })
  }

}
