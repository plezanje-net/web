import { Component, Input, OnChanges } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-responsive-image',
  templateUrl: './responsive-image.component.html',
  styleUrls: ['./responsive-image.component.scss'],
})
export class ResponsiveImageComponent implements OnChanges {
  @Input() imageWidths: number[];
  @Input() fallbackWidth: number;
  @Input() imagePath: string;
  @Input() renderSizes: string;
  @Input() imageAlt: string;
  @Input() maxIntrinsicWidth: number;

  storageUrl = environment.storageUrl;

  avifSrcset: string;
  webpSrcset: string;
  jpgSrcset: string;

  constructor() {}

  ngOnChanges(): void {
    this.avifSrcset = this.generateSrcset(this.imageWidths, 'avif');
    this.webpSrcset = this.generateSrcset(this.imageWidths, 'webp');
    this.jpgSrcset = this.generateSrcset(this.imageWidths, 'jpg');
  }

  private generateSrcset(imageWidths: number[], format: string) {
    let srcset = '';
    imageWidths.every((width) => {
      // If the 'requested' image size is not available
      if (width > this.maxIntrinsicWidth) {
        srcset += `${this.storageUrl}/images/${width}/${this.imagePath}.${format} ${this.maxIntrinsicWidth}w, `; // this is best of what we have to offer
        return false; // break loop, because larger sizes are then also unavailable
      }

      srcset += `${this.storageUrl}/images/${width}/${this.imagePath}.${format} ${width}w, `;
      return true;
    });

    srcset = srcset.slice(0, -2); // remove last space and comma

    return srcset;
  }
}
