import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorModule } from '@tinymce/tinymce-angular';
import { EditorComponent } from './editor/editor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AscentTypePipe } from './pipes/ascent-type.pipe';
import { GenderizeVerbPipe } from './pipes/genderize-verb.pipe';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SnackBarButtonsComponent } from './snack-bar-buttons/snack-bar-buttons.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { GradeSelectComponent } from './components/grade-select/grade-select.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectModule } from '@angular/material/select';
import { OrientationPipe } from './pipes/orientation.pipe';
import { CustomBreakpointsProvider } from './custom-breakpoints';

@NgModule({
  declarations: [
    EditorComponent,
    SnackBarButtonsComponent,
    GradeSelectComponent,
    AscentTypePipe,
    GenderizeVerbPipe,
    OrientationPipe,
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
  providers: [CustomBreakpointsProvider],
  exports: [
    EditorComponent,
    SnackBarButtonsComponent,
    GradeSelectComponent,
    AscentTypePipe,
    GenderizeVerbPipe,
    OrientationPipe,
  ],
})
export class SharedModule {}
