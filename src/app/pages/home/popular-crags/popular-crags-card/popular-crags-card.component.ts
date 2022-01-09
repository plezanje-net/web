import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { take } from 'rxjs/operators';
import { DataError } from 'src/app/types/data-error';
import { PopularCragsGQL, PopularCragsQuery } from 'src/generated/graphql';
import { LoadingSpinnerService } from '../../loading-spinner.service';

@Component({
  selector: 'app-popular-crags-card',
  templateUrl: './popular-crags-card.component.html',
  styleUrls: ['./popular-crags-card.component.scss'],
})
export class PopularCragsCardComponent implements OnInit {
  constructor(
    private popularCragsGQL: PopularCragsGQL,
    private loadingSpinnerService: LoadingSpinnerService
  ) {}

  loading = true;

  popularCrags: PopularCragsQuery['popularCrags'];
  expand = false;

  @Input() dateFrom: string;
  @Input() top: number;
  @Input() title: string;

  @Output() errorEvent = new EventEmitter<DataError>();

  ngOnInit(): void {
    this.loadingSpinnerService.pushLoader();
    this.popularCragsGQL
      .fetch({
        dateFrom: this.dateFrom,
        top: this.top,
      })
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.loading = false;
          this.loadingSpinnerService.popLoader();
          if (result.errors != null) {
            this.queryError();
          } else {
            this.popularCrags = result.data.popularCrags;
          }
        },
        error: () => {
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
}
