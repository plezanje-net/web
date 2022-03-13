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
  _routeCommentsInitialized: boolean | null;
  _routeGradesInitialized: boolean | null;

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
          console.error('Error fetching route difficulty votes');
        }
      });
  }

  routeDiffVotesQuerySuccess(queryData: RouteDifficultyVotesQuery): void {
    this.gradeDistribution = getGradeDistribution(
      queryData.route.difficultyVotes.filter((vote) => !vote.isBase)
    );

    if (this.gradeDistribution.length) {
      this.routeGradesInitialized = false;
    } else {
      this.routeGradesInitialized = null;
    }
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
          console.error('Error fetching route comments');
        }
      });
  }

  routeCommentsQuerySuccess(queryData: RouteCommentsQuery): void {
    this.routeComments = queryData.route.comments;

    if (this.routeComments.length) {
      this.routeCommentsInitialized = false;
    } else {
      this.routeCommentsInitialized = null;
    }
  }

  get routeGradesInitialized() {
    return this._routeGradesInitialized;
  }

  get routeCommentsInitialized() {
    return this._routeCommentsInitialized;
  }

  set routeGradesInitialized(value: boolean | null) {
    this._routeGradesInitialized = value;
    this.afterChildInitialized();
  }

  set routeCommentsInitialized(value: boolean | null) {
    this._routeCommentsInitialized = value;
    this.afterChildInitialized();
  }

  afterChildInitialized() {
    if (
      ![this.routeCommentsInitialized, this.routeGradesInitialized].some(
        (childInitialized) => childInitialized === false
      )
    ) {
      this.heightChangeEvent.emit(
        (this.container.nativeElement as HTMLDivElement).clientHeight
      );
    }
  }
}
