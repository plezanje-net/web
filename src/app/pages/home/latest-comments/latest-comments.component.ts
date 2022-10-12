import { Component, OnInit } from '@angular/core';
import { LatestCommentsGQL, LatestCommentsQuery } from 'src/generated/graphql';

@Component({
  selector: 'app-latest-comments',
  templateUrl: './latest-comments.component.html',
  styleUrls: ['./latest-comments.component.scss'],
})
export class LatestCommentsComponent implements OnInit {
  loading: boolean;
  comments: LatestCommentsQuery['latestComments']['items'];

  constructor(private latestCommentsGQL: LatestCommentsGQL) {}

  ngOnInit(): void {
    this.loading = true;

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
      },
      error: () => {
        console.log('TODO');
      },
    });
  }
}
