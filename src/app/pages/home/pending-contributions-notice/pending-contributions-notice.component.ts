import { Component, OnInit } from '@angular/core';
import { map, of, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Contribution, PendingContributionsGQL } from 'src/generated/graphql';
import { LoadingSpinnerService } from '../loading-spinner.service';

@Component({
  selector: 'app-pending-contributions-notice',
  templateUrl: './pending-contributions-notice.component.html',
  styleUrls: ['./pending-contributions-notice.component.scss'],
})
export class PendingContributionsNoticeComponent implements OnInit {
  isAdmin = false;
  pendingDrafts: Contribution[];
  pendingInReviews: Contribution[];

  constructor(
    private authService: AuthService,
    public loadingSpinnerService: LoadingSpinnerService,
    private pendingContributionsGQL: PendingContributionsGQL
  ) {}

  ngOnInit(): void {
    this.authService.currentUser
      .pipe(
        switchMap((user) => {
          if (!user) {
            return of(null);
          } else {
            return this.pendingContributionsGQL.fetch().pipe(
              map((response) => ({
                user,
                contributions: response.data.contributions,
              }))
            );
          }
        })
      )
      .subscribe((userAndContributions) => {
        if (userAndContributions) {
          const { user, contributions } = userAndContributions;
          this.pendingDrafts = contributions.filter(
            (contribution) => contribution.publishStatus === 'draft'
          );

          this.pendingInReviews = contributions.filter(
            (contribution: Contribution) =>
              contribution.publishStatus === 'in_review'
          );

          this.isAdmin = user.roles.includes('admin');
        } else {
          this.pendingDrafts = [];
          this.pendingInReviews = [];
          this.isAdmin = false;
        }
      });
  }
}
