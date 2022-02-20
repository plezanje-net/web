import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { IDistribution } from 'src/app/common/distribution-chart/distribution-chart.component';
import { getGradeDistribution } from 'src/app/common/grade-distribution';
import {
  RouteCommentsGQL,
  RouteCommentsQuery,
  RouteDifficultyVotesGQL,
  RouteDifficultyVotesQuery,
} from 'src/generated/graphql';

@Component({
  selector: 'app-crag-route-preview',
  templateUrl: './crag-route-preview.component.html',
  styleUrls: ['./crag-route-preview.component.scss'],
})
export class CragRoutePreviewComponent implements OnChanges {
  gradeDistribution: IDistribution[] = [];
  gradeDistributionLoading: boolean;
  routeComments: Record<string, string | any>[];
  routeCommentsLoading: boolean;
  childViewsInitialized = {};

  @Input() routeId: string;
  @Output() heightChangeEvent = new EventEmitter<number>();
  @ViewChild('container') container: ElementRef;

  constructor(
    private routeCommentsGQL: RouteCommentsGQL,
    private routeDifficultyVotesGQL: RouteDifficultyVotesGQL
  ) {}

  ngOnChanges(): void {
    if (this.routeId) {
      this.fetchDifficultyVotesDistribution(this.routeId);
      this.fetchRouteComments(this.routeId);
    }
  }

  fetchDifficultyVotesDistribution(routeId: string): void {
    this.gradeDistributionLoading = true;

    this.routeDifficultyVotesGQL
      .watch({ routeId })
      .valueChanges.subscribe((result) => {
        this.gradeDistributionLoading = false;

        if (!result.errors) {
          this.routeDiffVotesQuerySuccess(result.data);
        } else {
          this.routeDiffVotesQueryError();
        }
      });
  }

  routeDiffVotesQuerySuccess(queryData: RouteDifficultyVotesQuery): void {
    this.gradeDistribution = getGradeDistribution(
      queryData.route.difficultyVotes.filter((vote) => !vote.isBase)
    );
    if (this.gradeDistribution.length) {
      this.childViewsInitialized['grades'] = false;
    }
  }

  routeDiffVotesQueryError(): void {
    console.error('TODO');
  }

  fetchRouteComments(routeId: string): void {
    this.routeCommentsLoading = true;

    this.routeCommentsGQL
      .watch({ routeId: routeId })
      .valueChanges.subscribe((result) => {
        this.routeCommentsLoading = false;

        if (!result.errors) {
          this.routeCommentsQuerySuccess(result.data);
        } else {
          this.routeCommentsQueryError();
        }
      });
  }

  routeCommentsQuerySuccess(queryData: RouteCommentsQuery): void {
    this.routeComments = queryData.route.comments;
    if (this.routeComments.length) {
      this.childViewsInitialized['comments'] = false;
    }
    // TODO filter out conditions and warnings? ask in slack
  }

  routeCommentsQueryError(): void {
    console.error('TODO');
  }

  onChildViewInit(child: string): void {
    this.childViewsInitialized[child] = true;

    if (
      Object.keys(this.childViewsInitialized).length &&
      !Object.values(this.childViewsInitialized).includes(false)
    ) {
      this.heightChangeEvent.emit(
        (this.container.nativeElement as HTMLDivElement).clientHeight
      );
    }
  }
}
