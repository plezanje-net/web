import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent {
  // these two properties are not yet used but will probably be used to define to which entity should the image be attached to
  @Input() type: string;
  @Input() entityId: string;

  fileName = '';
  fileSelected = false;
  submitting = false;
  form = new FormGroup({
    image: new FormControl(null),
    type: new FormControl('photo'),
    description: new FormControl(null),
  });

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files[0];

    if (!file) return;

    this.fileName = file.name;
    this.fileSelected = true;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.form.patchValue({
        image: reader.result,
      });
    };
  }

  submit(): void {
    if (!this.form.get('image').value) return;
    this.submitting = true;

    let formData = new FormData();
    formData.append('image', this.form.get('image').value);
    formData.append('type', this.form.get('type').value);

    if (this.form.get('description').value) {
      formData.append('description', this.form.get('description').value);
    }

    this.http
      .post(`${environment.apiUrl}/TODO-image-upload-endpoint`, formData)
      .subscribe({
        next: () => {
          this.submitting = false;
          this.snackBar.open('Fotografija je bila shranjena.', null, {
            duration: 3000,
          });
        },
        error: () => {
          this.submitting = false;
          this.snackBar.open('Fotografije ni bilo mogoče shraniti.', null, {
            duration: 3000,
            panelClass: 'error',
          });
        },
      });
  }
}
