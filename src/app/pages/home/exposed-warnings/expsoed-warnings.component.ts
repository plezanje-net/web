import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { take } from 'rxjs';
import {
  ExposedWarningsGQL,
  ExposedWarningsQuery,
} from '../../../../generated/graphql';
import { DataError } from '../../../types/data-error';
import { LoadingSpinnerService } from '../loading-spinner.service';

import SwiperCore, { Autoplay, Pagination } from 'swiper';

SwiperCore.use([Pagination, Autoplay]);

@Component({
  selector: 'app-exposed-warnings',
  templateUrl: './exposed-warnings.component.html',
  styleUrls: ['./exposed-warnings.component.scss'],
})
export class ExposedWarningsComponent implements OnInit {
  @Output() errorEvent = new EventEmitter<DataError>();

  warnings: ExposedWarningsQuery['exposedWarnings'];

  constructor(
    private exposedWarnings: ExposedWarningsGQL,
    private loadingSpinnerService: LoadingSpinnerService
  ) {}

  ngOnInit(): void {
    this.loadingSpinnerService.pushLoader();
    this.exposedWarnings
      .fetch()
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          if (!result.errors) {
            this.warnings = result.data.exposedWarnings;
          } else {
            this.queryError();
          }
        },
        error: () => {
          this.queryError();
        },
        complete: () => {
          this.loadingSpinnerService.popLoader();
        },
      });
  }

  queryError() {
    this.errorEvent.emit({
      message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
    });
  }
}
