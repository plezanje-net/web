import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.scss'],
})
export class ConfirmAccountComponent implements OnInit {
  loading = true;
  success = false;

  constructor(private activatedRoute: ActivatedRoute, private apollo: Apollo) {}

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
  }
}
