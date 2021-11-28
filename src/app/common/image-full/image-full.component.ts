import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { LatestImagesQuery } from 'src/generated/graphql';

@Component({
  selector: 'app-image-full',
  templateUrl: './image-full.component.html',
  styleUrls: ['./image-full.component.scss'],
})
export class ImageFullComponent {
  storageUrl = environment.storageUrl;
  // storageUrl = '/assets/sampleimages'; // TODO: this is a test

  constructor(
    public dialogRef: MatDialogRef<ImageFullComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { image: LatestImagesQuery['latestImages'][0] }
  ) {}

  onClick() {
    this.dialogRef.close();
  }
}