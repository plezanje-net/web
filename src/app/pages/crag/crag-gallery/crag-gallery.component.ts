import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { ImageFullComponent } from 'src/app/common/image-full/image-full.component';
import { AuthService } from 'src/app/auth/auth.service';
import { ImageUploadComponent } from 'src/app/shared/components/image-upload/image-upload.component';

@Component({
  selector: 'app-crag-gallery',
  templateUrl: './crag-gallery.component.html',
  styleUrls: ['./crag-gallery.component.scss'],
})
export class CragGalleryComponent {
  @Input() images: string;
  @Input() cragId: string;

  storageUrl = environment.storageUrl;

  constructor(private dialog: MatDialog, private authService: AuthService) {}

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

  async onAddImagesClick(): Promise<void> {
    const allowed = await this.authService.guardedAction({});

    if (allowed) {
      this.dialog.open(ImageUploadComponent, {
        data: {
          type: 'crag',
          entityId: this.cragId,
        },
        autoFocus: false,
      });
    }
  }
}
