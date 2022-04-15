import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { Image } from 'src/generated/graphql';

@Component({
  selector: 'app-image-full',
  templateUrl: './image-full.component.html',
  styleUrls: ['./image-full.component.scss'],
})
export class ImageFullComponent {
  storageUrl = environment.storageUrl;

  renderSizes: string;

  constructor(
    public dialogRef: MatDialogRef<ImageFullComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { image: Image }
  ) {
    // Generate renderSizes parameter here, to make it more readable
    // Image is alway rendered 'by width' by the browser.
    // Limitations of the image width can be either: height of the viewport, width of the viewport, intrinsic width of the image (user uploaded a too small image...)
    this.renderSizes = `min(calc((100vh - 152px) * ${data.image.aspectRatio}), calc(100vw - 128px), ${data.image.maxIntrinsicWidth}px)`;
    // not very nice, but is explained like this>
    // For height:
    //  matDialog padding: 24px (top), 24px (bottom), Caption has fixed height: 64px, Close button has fixed height: 40px. ∑ = 152px
    // For width:
    // matDialof padding: 24px (left), 24px (right), Prev button 40px, Next button 40px. ∑ = 128px
  }

  onCloseClick() {
    this.dialogRef.close();
  }

  onNextImageClick() {
    // TODO:
    console.log('display next');
  }

  onPreviousImageClick() {
    // TODO:
    console.log('display previous');
  }
}
