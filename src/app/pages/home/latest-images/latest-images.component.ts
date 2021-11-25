import { Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { ImageFullComponent } from 'src/app/common/image-full/image-full.component';
import { environment } from 'src/environments/environment';
import { LatestImagesGQL, LatestImagesQuery } from 'src/generated/graphql';

@Component({
  selector: 'app-latest-images',
  templateUrl: './latest-images.component.html',
  styleUrls: ['./latest-images.component.scss'],
})
export class LatestImagesComponent implements OnInit {
  latestImages: LatestImagesQuery['latestImages'];

  ncols = 4;
  storageUrl = environment.storageUrl;
  // storageUrl = '/assets/sampleimages'; // TODO: this is a test

  constructor(
    private mediaObserver: MediaObserver,
    private latestImagesGQL: LatestImagesGQL,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.mediaObserver.asObservable().subscribe((change) => {
      console.log(change[0].mqAlias);
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

    this.latestImagesGQL
      .fetch({ latest: 12 })
      .toPromise()
      .then((result) => {
        this.latestImages = result.data.latestImages;
        console.log(result);
      });
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
}
