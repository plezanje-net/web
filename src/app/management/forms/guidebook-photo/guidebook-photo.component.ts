import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ManagementCreateRouteGQL } from 'src/generated/graphql';

interface RouteData {
  name: string;
  difficulty: number;
}

export interface GuidebookPhotoData {
  sectorId: string;
  maxRoutePosition: number;
}

@Component({
  selector: 'app-guidebook-photo',
  templateUrl: './guidebook-photo.component.html',
  styleUrls: ['./guidebook-photo.component.scss'],
})
export class GuidebookPhotoComponent {
  fileToUpload: File;
  loading = false;
  form = new FormGroup({
    image: new FormControl(),
  });

  // Configuration for image resizing
  maxWidth = 1200;
  maxHeight = 1200;
  imageQuality = 0.8;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: GuidebookPhotoData,
    public dialogRef: MatDialogRef<GuidebookPhotoComponent>,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private createGQL: ManagementCreateRouteGQL
  ) {}

  onFileSelected(event: Event) {
    this.fileToUpload = (<HTMLInputElement>event.target).files.item(0);
  }

  /**
   * Resizes an image file and returns a promise that resolves with the resized image as a Blob
   * @param file The image file to resize
   * @returns Promise<Blob> A promise that resolves with the resized image as a Blob
   */
  private resizeImage(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      // Create an image element to load the file
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > this.maxWidth) {
          height = Math.round(height * (this.maxWidth / width));
          width = this.maxWidth;
        }

        if (height > this.maxHeight) {
          width = Math.round(width * (this.maxHeight / height));
          height = this.maxHeight;
        }

        // Create a canvas and draw the resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            // Revoke the object URL to free memory
            URL.revokeObjectURL(img.src);
            resolve(blob);
          },
          file.type,
          this.imageQuality
        );
      };

      img.onerror = (error) => {
        URL.revokeObjectURL(img.src);
        reject(error);
      };
    });
  }

  submit() {
    if (!this.fileToUpload) {
      this.snackBar.open('Prosim izberite fotografijo.', null, {
        duration: 3000,
        panelClass: 'error',
      });
      return;
    }

    this.loading = true;

    // Resize the image before uploading
    this.resizeImage(this.fileToUpload)
      .then((resizedImageBlob) => {
        // Create a new File object from the Blob
        const resizedImageFile = new File(
          [resizedImageBlob],
          this.fileToUpload.name,
          {
            type: this.fileToUpload.type,
            lastModified: this.fileToUpload.lastModified,
          }
        );

        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('image', resizedImageFile);

        // Include the sector ID in the request if available
        if (this.data && this.data.sectorId) {
          formData.append('sectorId', this.data.sectorId);
        }

        // Make request to GPT-4 mini API
        this.http
          .post<{ output: RouteData[] }>(environment.guidebookScanURL, formData)
          .subscribe({
            next: async (response) => {
              let position = this.data?.maxRoutePosition || 0;
              for (const route of response.output) {
                position++;
                await this.createGQL
                  .mutate({
                    input: {
                      name: route.name,
                      baseDifficulty: route.difficulty,
                      sectorId: this.data.sectorId,
                      defaultGradingSystemId: 'font',
                      routeTypeId: 'boulder',
                      isProject: false,
                      position,
                      publishStatus: 'draft',
                    },
                  })
                  .toPromise();
              }
              this.loading = false;
              // Return both the file and the extracted routes data
              this.dialogRef.close({
                file: resizedImageFile,
                routesData: response.output,
                sectorId: this.data?.sectorId,
                maxRoutePosition: this.data?.maxRoutePosition,
              });

              this.snackBar.open('Smeri so bile dodane.', null, {
                duration: 3000,
              });
            },
            error: (error) => {
              this.loading = false;

              console.error('Error analyzing photo:', error);
              this.snackBar.open(
                'Napaka pri analizi fotografije. Poskusite znova.',
                null,
                {
                  duration: 3000,
                  panelClass: 'error',
                }
              );

              // Just return the file without route data in case of error
              this.dialogRef.close({
                file: resizedImageFile,
                sectorId: this.data?.sectorId,
                maxRoutePosition: this.data?.maxRoutePosition,
              });
            },
          });
      })
      .catch((error) => {
        this.loading = false;
        console.error('Error resizing image:', error);
        this.snackBar.open(
          'Napaka pri obdelavi fotografije. Poskusite znova.',
          null,
          {
            duration: 3000,
            panelClass: 'error',
          }
        );
      });
  }
}
