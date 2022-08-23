import { Component, OnInit } from '@angular/core';
import { LatestCommentsGQL } from 'src/generated/graphql';

@Component({
  selector: 'app-latest-comments',
  templateUrl: './latest-comments.component.html',
  styleUrls: ['./latest-comments.component.scss'],
})
export class LatestCommentsComponent implements OnInit {
  loading = true;
  comments: {
    __typename?: 'Comment';
    id: string;
    type: string;
    content?: string;
    created: any;
    updated: any;
    user?: { __typename?: 'User'; id: string; fullName: string };
    crag?: {
      __typename?: 'Crag';
      name: string;
      slug: string;
      country: { __typename?: 'Country'; slug: string; name: string };
    };
    route?: { __typename?: 'Route'; name: string };
  }[];

  constructor(private latestCommentsGQL: LatestCommentsGQL) {}

  ngOnInit(): void {
    this.loading = false;

    const latestComments$ = this.latestCommentsGQL.fetch({ limit: 10 });

    latestComments$.subscribe({
      next: (result) => {
        this.comments = result.data.latestComments;
        console.log(result.data.latestComments);
        this.loading = false;
      },
      error: () => {
        console.log('TODO');
      },
    });
  }
}
