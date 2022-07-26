import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LayoutService } from 'src/app/services/layout.service';
import { DataError } from 'src/app/types/data-error';
import { LoadingSpinnerService } from './loading-spinner.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  error: DataError;
  loading = true;
  subscription: Subscription;

  constructor(
    private layoutService: LayoutService,
    public loadingSpinnerService: LoadingSpinnerService
  ) {}

  ngOnInit(): void {
    this.subscription = this.loadingSpinnerService.showLoader$
      .pipe(delay(0))
      .subscribe((isLoading) => (this.loading = isLoading));

    this.layoutService.$breadcrumbs.next([
      {
        name: 'Prva stran',
      },
    ]);

    this.layoutService.setTitle();
  }

  handleError(error: DataError) {
    this.error = error;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
