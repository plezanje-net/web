import { Component, OnInit } from '@angular/core';
import { DataError } from 'src/app/types/data-error';
import { LatestCommentsGQL, LatestCommentsQuery } from 'src/generated/graphql';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-comments-history',
  templateUrl: './comments-history.component.html',
  styleUrls: ['./comments-history.component.scss'],
})
export class CommentsHistoryComponent implements OnInit {
  loading: boolean;
  error: DataError = null;

  comments: LatestCommentsQuery['latestComments']['items'];
  pagination: LatestCommentsQuery['latestComments']['meta'];

  constructor(
    private latestCommentsGQL: LatestCommentsGQL,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          this.loading = true;

          return this.latestCommentsGQL.fetch({
            input: {
              pageSize: 20,
              pageNumber: Number(params.get('pageNumber')) || 1,
            },
          });
        })
      )
      .subscribe({
        next: (result) => {
          this.comments = result.data.latestComments.items;
          this.pagination = result.data.latestComments.meta;
          this.loading = false;
          this.error = null;
        },
        error: () => {
          this.error = {
            message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
          };
        },
      });
  }

  onPageChange(pageEvent: PageEvent) {
    this.router.navigate([
      '/pregledi/komentarji',
      {
        pageNumber: pageEvent.pageIndex + 1,
      },
    ]);
  }
}
