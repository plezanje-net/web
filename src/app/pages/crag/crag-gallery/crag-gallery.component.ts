import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageFullComponent } from 'src/app/common/image-full/image-full.component';

@Component({
  selector: 'app-crag-gallery',
  templateUrl: './crag-gallery.component.html',
  styleUrls: ['./crag-gallery.component.scss'],
})
export class CragGalleryComponent {
  @Input() images: string;

  constructor(private dialog: MatDialog) {}

  onImageClick(index: number): void {
    this.dialog.open(ImageFullComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: { images: this.images, currentImageIndex: index },
      autoFocus: false,
    });
  }
}
