import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { ImageFullComponent } from 'src/app/common/image-full/image-full.component';
import { DataError } from 'src/app/types/data-error';
import { environment } from 'src/environments/environment';
import { LatestImagesGQL, LatestImagesQuery } from 'src/generated/graphql';
import { LoadingSpinnerService } from '../loading-spinner.service';

@Component({
  selector: 'app-latest-images',
  templateUrl: './latest-images.component.html',
  styleUrls: ['./latest-images.component.scss'],
})
export class LatestImagesComponent implements OnInit {
  @Output() errorEvent = new EventEmitter<DataError>();
  loading = true;

  latestImages: LatestImagesQuery['latestImages'];

  ncols = 4;
  storageUrl = environment.storageUrl;
  // storageUrl = '/assets/sampleimages'; // TODO: this is a test

  constructor(
    private mediaObserver: MediaObserver,
    private latestImagesGQL: LatestImagesGQL,
    private dialog: MatDialog,
    private loadingSpinnerService: LoadingSpinnerService
  ) {}

  ngOnInit(): void {
    this.mediaObserver.asObservable().subscribe((change) => {
      switch (change[0].mqAlias) {
        case 'lg':
        case 'xl':
          this.ncols = 4;
          break;
        case 'md':
          this.ncols = 3;
          break;
        case 'sm':
          this.ncols = 2;
          break;
        case 'xs':
          this.ncols = 1;
      }
    });

    this.loadingSpinnerService.pushLoader();
    this.latestImagesGQL
      .fetch({ latest: 12 })
      .toPromise()
      .then(
        (result) => {
          this.loading = false;
          this.loadingSpinnerService.popLoader();
          if (result.errors == null) {
            this.latestImages = result.data.latestImages;
          } else {
            this.queryError();
          }
        },
        (_error) => {
          this.loadingSpinnerService.popLoader();
          this.queryError();
        }
      );
  }

  onImageClick(image: LatestImagesQuery['latestImages'][0]) {
    this.dialog.open(ImageFullComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: { image },
    });
  }

  queryError() {
    this.errorEvent.emit({
      message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
    });
  }
}
