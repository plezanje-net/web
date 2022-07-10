import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { FilteredTable } from 'src/app/common/filtered-table';
import { LayoutService } from 'src/app/services/layout.service';
import { DataError } from 'src/app/types/data-error';
import {
  DifficultyVote,
  DifficultyVotesGQL,
  LatestDifficultyVotesInput,
  MyActivityRoutesQuery,
} from 'src/generated/graphql';

@Component({
  selector: 'app-difficulty-votes',
  templateUrl: './difficulty-votes.component.html',
  styleUrls: ['./difficulty-votes.component.scss'],
})
export class DifficultyVotesComponent implements OnInit, OnDestroy {
  loading = false;
  error: DataError = null;
  subscriptions: Subscription[] = [];

  difficultyVotes: DifficultyVote[];
  pagination: MyActivityRoutesQuery['myActivityRoutes']['meta'];

  filteredTable = new FilteredTable([], []);

  constructor(
    private layoutService: LayoutService,
    private difficultyVotesGQL: DifficultyVotesGQL,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.layoutService.$breadcrumbs.next([
      {
        path: '/pregledi',
        name: 'Pregledi',
      },
      {
        name: 'Predlagane ocene',
      },
    ]);

    const ft = this.filteredTable;

    const navSub = ft.navigate$.subscribe((params) =>
      this.router.navigate(['/pregledi/ocene', params])
    );
    this.subscriptions.push(navSub);

    const routeParamsSub = this.activatedRoute.params
      .pipe(
        switchMap((params) => {
          ft.setRouteParams(params);
          this.loading = true;
          const queryParams: LatestDifficultyVotesInput = ft.queryParams;

          return this.difficultyVotesGQL.watch({ input: queryParams })
            .valueChanges;
        })
      )
      .subscribe({
        next: (result) => {
          this.loading = false;
          ft.navigating = false;
          this.pagination = result.data.latestDifficultyVotes.meta;
          this.difficultyVotes = <DifficultyVote[]>(
            result.data.latestDifficultyVotes.items
          );
          this.error = null;
        },
        error: () => {
          this.error = {
            message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
          };
        },
      });
    this.subscriptions.push(routeParamsSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
