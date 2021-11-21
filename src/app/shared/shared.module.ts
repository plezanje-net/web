import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { EditorComponent } from './editor/editor.component';
import { AscentTypePipe } from './pipes/ascent-type.pipe';
import { GenderizeVerbPipe } from './pipes/genderize-verb.pipe';

@NgModule({
  declarations: [EditorComponent, AscentTypePipe, GenderizeVerbPipe],
  imports: [CommonModule, EditorModule, ReactiveFormsModule],
  exports: [EditorComponent, AscentTypePipe, GenderizeVerbPipe],
})
export class SharedModule {}
