import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { DataError } from 'src/app/types/data-error';
import { PopularCrag, PopularCragsGQL } from 'src/generated/graphql';
import { LoadingSpinnerService } from '../../loading-spinner.service';

@Component({
  selector: 'app-popular-crags-card',
  templateUrl: './popular-crags-card.component.html',
  styleUrls: ['./popular-crags-card.component.scss'],
})
export class PopularCragsCardComponent implements OnInit, OnDestroy {
  constructor(
    private popularCragsGQL: PopularCragsGQL,
    private loadingSpinnerService: LoadingSpinnerService,
    private authService: AuthService
  ) {}

  loading = true;
  subscription: Subscription;

  popularCrags: PopularCrag[];

  expand = false;

  @Input() dateFrom: string;
  @Input() top: number;
  @Input() title: string;

  @Output() errorEvent = new EventEmitter<DataError>();

  ngOnInit(): void {
    this.subscription = this.authService.currentUser
      .pipe(
        switchMap((user) => {
          this.loadingSpinnerService.pushLoader();
          return this.popularCragsGQL.fetch({
            dateFrom: this.dateFrom,
            top: this.top,
          });
        })
      )
      .subscribe({
        next: (result) => {
          this.loading = false;
          this.loadingSpinnerService.popLoader();
          this.popularCrags = <PopularCrag[]>result.data.popularCrags;
        },
        error: (error) => {
          this.loadingSpinnerService.popLoader();
          this.queryError();
        },
      });
  }

  queryError() {
    this.errorEvent.emit({
      message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
