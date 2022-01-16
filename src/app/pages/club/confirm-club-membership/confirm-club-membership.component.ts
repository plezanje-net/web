import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ConfirmClubMembershipGQL,
  ConfirmClubMembershipMutation,
} from 'src/generated/graphql';

@Component({
  selector: 'app-confirm-club-membership',
  templateUrl: './confirm-club-membership.component.html',
  styleUrls: ['./confirm-club-membership.component.scss'],
})
export class ConfirmClubMembershipComponent implements OnInit {
  loading = true;
  error = false;
  club: ConfirmClubMembershipMutation['confirmClubMembership'];

  constructor(
    private activatedRoute: ActivatedRoute,
    private confirmClubMembershipGQL: ConfirmClubMembershipGQL
  ) {}

  ngOnInit(): void {
    const clubMemberId = this.activatedRoute.snapshot.params.clubMemberId;
    const token = this.activatedRoute.snapshot.params.token;

    this.confirmClubMembershipGQL
      .mutate({
        input: {
          id: clubMemberId,
          token: token,
        },
      })
      .subscribe({
        next: (result) => {
          this.club = result.data.confirmClubMembership;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.error = true;
        },
      });
  }
}
