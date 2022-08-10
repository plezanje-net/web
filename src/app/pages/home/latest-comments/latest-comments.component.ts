import { Component, OnInit } from '@angular/core';
import { LatestCommentsGQL } from 'src/generated/graphql';

@Component({
  selector: 'app-latest-comments',
  templateUrl: './latest-comments.component.html',
  styleUrls: ['./latest-comments.component.scss'],
})
export class LatestCommentsComponent implements OnInit {
  loading = true;

  constructor(private latestCommentsGQL: LatestCommentsGQL) {}

  ngOnInit(): void {
    this.loading = false;

    const latestComments$ = this.latestCommentsGQL.fetch({ limit: 10 });

    latestComments$.subscribe({
      next: (result) => {
        console.log(result.data.latestComments);
        // TODO shrani komentarje in jih izriši
      },
      error: () => {
        console.log('TODO');
      },
    });
  }
}
