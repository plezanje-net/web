import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataError } from 'src/app/types/data-error';
import { LatestCommentsGQL, LatestCommentsQuery } from 'src/generated/graphql';
import { LoadingSpinnerService } from '../loading-spinner.service';

@Component({
  selector: 'app-latest-comments',
  templateUrl: './latest-comments.component.html',
  styleUrls: ['./latest-comments.component.scss'],
})
export class LatestCommentsComponent implements OnInit {
  @Output() errorEvent = new EventEmitter<DataError>();

  loading: boolean;
  comments: LatestCommentsQuery['latestComments']['items'];

  constructor(
    private latestCommentsGQL: LatestCommentsGQL,
    private loadingSpinnerService: LoadingSpinnerService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.loadingSpinnerService.pushLoader();

    const latestComments$ = this.latestCommentsGQL.fetch({
      input: {
        pageSize: 5,
        pageNumber: 1,
      },
    });

    latestComments$.subscribe({
      next: (result) => {
        this.comments = result.data.latestComments.items;
        this.loading = false;
        this.loadingSpinnerService.popLoader();
      },
      error: () => {
        this.loadingSpinnerService.popLoader();
        this.errorEvent.emit({
          message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
        });
      },
    });
  }
}
