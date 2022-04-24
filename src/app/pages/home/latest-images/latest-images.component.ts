import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ImageFullComponent } from 'src/app/common/image-full/image-full.component';
import { DataError } from 'src/app/types/data-error';
import { environment } from 'src/environments/environment';
import { Image, LatestImagesGQL } from 'src/generated/graphql';
import { LoadingSpinnerService } from '../loading-spinner.service';

@Component({
  selector: 'app-latest-images',
  templateUrl: './latest-images.component.html',
  styleUrls: ['./latest-images.component.scss'],
})
export class LatestImagesComponent implements OnInit, OnDestroy {
  @Output() errorEvent = new EventEmitter<DataError>();

  loading = true;
  subscription: Subscription;

  latestImages: Image[];

  ncols = 4;
  storageUrl = environment.storageUrl;

  constructor(
    private mediaObserver: MediaObserver,
    private latestImagesGQL: LatestImagesGQL,
    private dialog: MatDialog,
    private loadingSpinnerService: LoadingSpinnerService,
    private authService: AuthService
  ) {}

  // TODO: very small images get upsized because of object-fit: cover. but since this will probably be changed by redesign leave as is for now...
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

    this.subscription = this.authService.currentUser
      .pipe(
        switchMap((user) => {
          this.loadingSpinnerService.pushLoader();
          return this.latestImagesGQL.fetch({ latest: 12 });
        })
      )
      .subscribe({
        next: (result) => {
          this.loading = false;
          this.loadingSpinnerService.popLoader();
          this.latestImages = <Image[]>result.data.latestImages;
        },
        error: () => {
          this.loadingSpinnerService.popLoader();
          this.queryError();
        },
      });
  }

  onImageClick(index: number) {
    this.dialog.open(ImageFullComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: { images: this.latestImages, currentImageIndex: index },
      autoFocus: false,
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
