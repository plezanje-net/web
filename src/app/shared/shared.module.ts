import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorComponent } from './editor/editor.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SnackBarButtonsComponent } from './snack-bar-buttons/snack-bar-buttons.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { GradeSelectComponent } from './components/grade-select/grade-select.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    EditorComponent,
    SnackBarButtonsComponent,
    GradeSelectComponent,
  ],
  imports: [
    CommonModule,
    EditorModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
  ],
  exports: [EditorComponent, SnackBarButtonsComponent, GradeSelectComponent],
})
export class SharedModule {}
