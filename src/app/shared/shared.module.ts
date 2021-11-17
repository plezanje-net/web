import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { EditorComponent } from './editor/editor.component';

@NgModule({
  declarations: [EditorComponent],
  imports: [CommonModule, EditorModule, ReactiveFormsModule],
  exports: [EditorComponent],
})
export class SharedModule {}
