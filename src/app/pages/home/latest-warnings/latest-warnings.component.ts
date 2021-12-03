import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataError } from 'src/app/types/data-error';
import { LatestWarningsGQL, LatestWarningsQuery } from 'src/generated/graphql';
import $ from 'jquery';
import { LoadingSpinnerService } from '../loading-spinner.service';

@Component({
  selector: 'app-latest-warnings',
  templateUrl: './latest-warnings.component.html',
  styleUrls: ['./latest-warnings.component.scss'],
})
export class LatestWarningsComponent implements OnInit {
  @Output() errorEvent = new EventEmitter<DataError>();

  warnings: LatestWarningsQuery['latestWarnings'];

  slideConfig = {
    slidesToShow: 2,
    slidesToScroll: 2,
    infinite: true,
    dots: true,
    // adaptiveHeight: true,  // this does not work when 2 slides per view
    autoplay: true,
    autoplaySpeed: 3000, // keeping default
    speed: 300, // keeping default
    arrows: false,
    responsive: [
      {
        breakpoint: 905, // if less than 905, [0-904]
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  constructor(
    private latestWarningsGQL: LatestWarningsGQL,
    private loadingSpinnerService: LoadingSpinnerService
  ) {
    jQuery(window).on('load', () => {
      this.adaptHeight();
    });
  }

  onSlickInit() {
    this.adaptHeight();
  }

  ngOnInit(): void {
    this.loadingSpinnerService.pushLoader();
    this.latestWarningsGQL
      .fetch({ latest: 10 }) // TODO: see todo below... all 'active'
      .toPromise()
      .then((result) => {
        if (!result.errors) {
          this.warnings = result.data.latestWarnings;
        } else {
          this.queryError();
        }
      })
      .catch(() => {
        this.queryError();
      })
      .finally(() => {
        this.loadingSpinnerService.popLoader();
      });
  }

  queryError() {
    this.errorEvent.emit({
      message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
    });
  }

  /**
   * next slide(s) coming in...
   */
  onSlickBeforeChange() {
    this.adaptHeight();
  }

  /**
   * adapts the height of currently active slides to the height of the tallest of active slides
   */
  adaptHeight() {
    const slider = $('.slick-slider'); // could get as param if more than 1 slider on page
    const heights = [];

    setTimeout(function () {
      // collect all active slides heights
      $('.slick-track .slick-active', slider).each(function () {
        heights.push($(this).outerHeight());
      });

      // find height of the tallest active slide
      const tallestSlide = Math.max(...heights);

      // set the current slider slick list height to tallest active slide height
      $('.slick-list', slider).height(tallestSlide);
    }, 0);
  }
}

// TODO: get only active eg. not expired warnings. add expiration field to BE first.
