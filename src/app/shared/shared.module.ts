import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
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
import { LoaderComponent } from './components/loader/loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommentComponent } from './components/comment/comment.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { CommentFormComponent } from './components/comment-form/comment-form.component';
import { CommentOptionsComponent } from './components/comment/comment-options/comment-options.component';
import { WarningsComponent } from './components/warnings/warnings.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { GradeComponent } from './components/grade/grade.component';
import { PluralizeNoun } from './pipes/pluralize-noun.pipe';
import { PluralizeVerb } from './pipes/pluralize-verb.pipe';
import { DataErrorComponent } from './components/data-error/data-error.component';
import { AscentTypeComponent } from './components/ascent-type/ascent-type.component';
import { AscentPublishOptionComponent } from './components/ascent-publish-option/ascent-publish-option.component';
import { ResponsiveImageComponent } from './components/responsive-image/responsive-image.component';
import { InfoPropertyComponent } from './components/info-property/info-property.component';
import { PublishStatusHintComponent } from './components/publish-status-hint/publish-status-hint.component';
import { RouterModule } from '@angular/router';
import { YesNoDialogComponent } from './components/yes-no-dialog/yes-no-dialog.component';

@NgModule({
  declarations: [
    EditorComponent,
    SnackBarButtonsComponent,
    GradeSelectComponent,
    GradeComponent,
    CommentComponent,
    CommentOptionsComponent,
    CommentFormComponent,
    WarningsComponent,
    LoaderComponent,
    DataErrorComponent,
    ConfirmationDialogComponent,
    AscentTypePipe,
    GenderizeVerbPipe,
    OrientationPipe,
    GradeComponent,
    PluralizeNoun,
    PluralizeVerb,
    AscentTypeComponent,
    AscentPublishOptionComponent,
    ResponsiveImageComponent,
    InfoPropertyComponent,
    PublishStatusHintComponent,
    YesNoDialogComponent,
  ],
  imports: [
    CommonModule,
    EditorModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    NgxMatSelectSearchModule,
    MatDatepickerModule,
    MatInputModule,
    RouterModule,
  ],
  providers: [
    CustomBreakpointsProvider,
    GenderizeVerbPipe,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
  exports: [
    EditorComponent,
    SnackBarButtonsComponent,
    GradeSelectComponent,
    GradeComponent,
    CommentComponent,
    CommentFormComponent,
    WarningsComponent,
    LoaderComponent,
    DataErrorComponent,
    ConfirmationDialogComponent,
    AscentTypePipe,
    GenderizeVerbPipe,
    OrientationPipe,
    AscentTypeComponent,
    AscentPublishOptionComponent,
    MatDatepickerModule,
    MatInputModule,
    GradeComponent,
    PluralizeNoun,
    PluralizeVerb,
    ResponsiveImageComponent,
    InfoPropertyComponent,
    PublishStatusHintComponent,
    YesNoDialogComponent,
  ],
})
export class SharedModule {}
