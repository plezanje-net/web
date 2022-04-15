import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { ImageFullComponent } from 'src/app/common/image-full/image-full.component';
import { Image } from 'src/generated/graphql';

@Component({
  selector: 'app-crag-gallery',
  templateUrl: './crag-gallery.component.html',
  styleUrls: ['./crag-gallery.component.scss'],
})
export class CragGalleryComponent implements OnInit {
  @Input() images: string;

  storageUrl = environment.storageUrl;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  onImageClick(image: Image): void {
    this.dialog.open(ImageFullComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: { image },
      autoFocus: false,
    });
  }
}
