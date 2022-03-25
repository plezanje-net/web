import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-responsive-image',
  templateUrl: './responsive-image.component.html',
  styleUrls: ['./responsive-image.component.scss'],
})
export class ResponsiveImageComponent implements OnInit {
  @Input() imageWidths: number[];
  @Input() fallbackWidth: number;
  @Input() imagePath: string;
  @Input() renderSizes: string;
  @Input() imageAlt: string;

  storageUrl = environment.storageUrl;

  avifSrcset: string;
  webpSrcset: string;
  jpgSrcset: string;

  constructor() {}

  ngOnInit(): void {
    this.avifSrcset = this.generateSrcset(this.imageWidths, 'avif');
    this.webpSrcset = this.generateSrcset(this.imageWidths, 'webp');
    this.jpgSrcset = this.generateSrcset(this.imageWidths, 'jpg');
  }

  private generateSrcset(imageWidths: number[], format: string) {
    return imageWidths
      .reduce(
        (prev: string, size: number) =>
          `${prev}${this.storageUrl}/images/${size}/${this.imagePath}.${format} ${size}w, `,
        ''
      )
      .slice(0, -2);
  }
}
