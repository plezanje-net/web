import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { DataError } from 'src/app/types/data-error';
import {
  DifficultyVote,
  LatestDifficultyVotesGQL,
} from 'src/generated/graphql';

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

  constructor(private latestDiffcultyVotesGQL: LatestDifficultyVotesGQL) {}

  ngOnInit(): void {
    const sub = this.latestDiffcultyVotesGQL
      .watch({
        input: { pageSize: 10 },
      })
      .valueChanges.subscribe({
        next: (result) => {
          this.loading = false;
          this.difficultyVotes = <DifficultyVote[]>(
            result.data.latestDifficultyVotes.items
          );
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
