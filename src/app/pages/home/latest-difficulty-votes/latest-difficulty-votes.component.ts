import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { DataError } from 'src/app/types/data-error';
import {
  DifficultyVote,
  LatestDifficultyVotesGQL,
} from 'src/generated/graphql';
import { LoadingSpinnerService } from '../loading-spinner.service';

@Component({
  selector: 'app-latest-difficulty-votes',
  templateUrl: './latest-difficulty-votes.component.html',
  styleUrls: ['./latest-difficulty-votes.component.scss'],
})
export class LatestDifficultyVotesComponent implements OnInit, OnDestroy {
  @Output() errorEvent = new EventEmitter<DataError>();

  loading = true;
  subscriptions: Subscription[] = [];
  difficultyVotes: DifficultyVote[] = [];

  subscription;

  constructor(
    private authService: AuthService,
    private latestDiffcultyVotesGQL: LatestDifficultyVotesGQL,
    private loadingSpinnerService: LoadingSpinnerService
  ) {}

  ngOnInit(): void {
    const sub = this.authService.currentUser
      .pipe(
        switchMap((user) => {
          this.loadingSpinnerService.pushLoader();
          return this.latestDiffcultyVotesGQL.fetch({
            input: { pageSize: 10 },
          });
        })
      )
      .subscribe({
        next: (result) => {
          setTimeout(() => {
            this.loadingSpinnerService.popLoader();
            this.loading = false;
            this.difficultyVotes = <DifficultyVote[]>(
              result.data.latestDifficultyVotes.items
            );
          }, 3000);
        },
        error: () => this.queryError(),
      });

    this.subscriptions.push(sub);
  }

  queryError() {
    this.errorEvent.emit({
      message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
