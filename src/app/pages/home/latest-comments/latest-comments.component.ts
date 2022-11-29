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
import { LatestCommentsGQL, LatestCommentsQuery } from 'src/generated/graphql';
import { LoadingSpinnerService } from '../loading-spinner.service';

@Component({
  selector: 'app-latest-comments',
  templateUrl: './latest-comments.component.html',
  styleUrls: ['./latest-comments.component.scss'],
})
export class LatestCommentsComponent implements OnInit, OnDestroy {
  @Output() errorEvent = new EventEmitter<DataError>();

  loading: boolean;
  comments: LatestCommentsQuery['latestComments']['items'];
  subscriptions: Subscription[] = [];

  constructor(
    private latestCommentsGQL: LatestCommentsGQL,
    private loadingSpinnerService: LoadingSpinnerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const sub = this.authService.currentUser
      .pipe(
        switchMap(() => {
          this.loading = true;
          this.loadingSpinnerService.pushLoader();

          return this.latestCommentsGQL.fetch({
            input: {
              pageSize: 5,
              pageNumber: 1,
            },
          });
        })
      )
      .subscribe({
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

    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
