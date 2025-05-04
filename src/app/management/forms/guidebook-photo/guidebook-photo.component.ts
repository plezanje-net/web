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

  submit() {
    if (!this.fileToUpload) {
      this.snackBar.open('Prosim izberite fotografijo.', null, {
        duration: 3000,
        panelClass: 'error',
      });
      return;
    }

    this.loading = true;

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('image', this.fileToUpload);

    // Include the sector ID in the request if available
    if (this.data && this.data.sectorId) {
      formData.append('sectorId', this.data.sectorId);
    }

    // Make request to GPT-4 mini API
    this.http
      .post<{ output: RouteData[] }>(
        'https://n8n-kkcc40kwskwcgkk4gokkkgos.ademsar.eu/webhook/ab7371f8-7b31-40c4-ac53-b1db3e292ed4',
        formData
      )
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
            file: this.fileToUpload,
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
            file: this.fileToUpload,
            sectorId: this.data?.sectorId,
            maxRoutePosition: this.data?.maxRoutePosition,
          });
        },
      });
  }
}
