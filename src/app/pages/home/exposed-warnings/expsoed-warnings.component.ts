import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { take } from 'rxjs';
import {
  ExposedWarningsGQL,
  ExposedWarningsQuery,
} from '../../../../generated/graphql';
import { DataError } from '../../../types/data-error';
import { LoadingSpinnerService } from '../loading-spinner.service';

import SwiperCore, { Autoplay, Pagination } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

SwiperCore.use([Pagination, Autoplay]);

@Component({
  selector: 'app-exposed-warnings',
  templateUrl: './exposed-warnings.component.html',
  styleUrls: ['./exposed-warnings.component.scss'],
})
export class ExposedWarningsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Output() errorEvent = new EventEmitter<DataError>();

  warnings: ExposedWarningsQuery['exposedWarnings'];

  @ViewChild('swiper', { static: false }) swiper: SwiperComponent;
  swiperObserver: IntersectionObserver;

  constructor(
    private exposedWarnings: ExposedWarningsGQL,
    private loadingSpinnerService: LoadingSpinnerService
  ) {}

  ngAfterViewInit(): void {
    // add observer so that the slider is stopped when out of view (to prevent flickering of content)
    this.swiperObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          this.swiper.swiperRef.autoplay.start();
        } else {
          this.swiper.swiperRef.autoplay.stop();
        }
      },
      {
        root: null,
        threshold: 1,
      }
    );
    const swiperEl = document.querySelector('swiper');
    this.swiperObserver.observe(swiperEl);
  }

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

  ngOnDestroy(): void {
    this.swiperObserver.disconnect();
  }
}
