import { Component, HostListener, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { environment } from 'src/environments/environment';
import { DeleteImageGQL, Image, User } from 'src/generated/graphql';

@Component({
  selector: 'app-image-full',
  templateUrl: './image-full.component.html',
  styleUrls: ['./image-full.component.scss'],
})
export class ImageFullComponent implements OnInit {
  storageUrl = environment.storageUrl;

  images: Image[];

  currentImageIndex: number;
  image: Image;
  currentUser: User;

  constructor(
    public dialogRef: MatDialogRef<ImageFullComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { images: Image[]; currentImageIndex: number },
    private deleteImageGQL: DeleteImageGQL,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.images = this.data.images;
    this.currentImageIndex = this.data.currentImageIndex;
    this.image = this.images[this.currentImageIndex];
  }

  ngOnInit() {
    this.authService.currentUser
      .pipe(take(1))
      .subscribe((user) => (this.currentUser = user));
  }

  /**
   * Generate renderSizes parameter here, to make it more readable
   * Image is alway rendered 'by width' by the browser.
   * Limitations of the image width can be either: height of the viewport, width of the viewport, intrinsic width of the image (user uploaded a too small image...)
   * Below px values are explained as follows:
   *  For height:
   *    matDialog padding: 24px (top), 24px (bottom), Caption has fixed height: 64px, Close button has fixed height: 40px. ∑ = 152px
   *  For width:
   *    matDialog padding: 24px (left), 24px (right), Prev button 40px, Next button 40px. ∑ = 128px
   */
  get renderSizes(): string {
    return `min(calc((100vh - 152px) * ${this.image.aspectRatio}), calc(100vw - 128px), ${this.image.maxIntrinsicWidth}px)`;
  }

  onCloseClick() {
    this.dialogRef.close();
  }

  onDeleteClick() {
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          message: 'Odstranim sliko?',
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result != null) {
          this.deleteImageGQL
            .mutate({ id: this.image.id })
            .subscribe(({ data }) => {
              if (data.deleteImage) {
                this.dialogRef.close();
                this.snackBar.open('Fotografija je bila odstranjena.', null, {
                  duration: 3000,
                });
              } else {
                this.snackBar.open(
                  'Fotografije ni bilo možno odstraniti.',
                  null,
                  {
                    duration: 3000,
                    panelClass: 'error',
                  }
                );
              }
            });
        }
      });
  }

  @HostListener('document:keydown.arrowright')
  onNextImageClick() {
    if (this.currentImageIndex < this.images.length - 1) {
      this.currentImageIndex++;
      this.image = this.data.images[this.currentImageIndex];
    }
  }

  @HostListener('document:keydown.arrowleft')
  onPreviousImageClick() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.image = this.data.images[this.currentImageIndex];
    }
  }
}
