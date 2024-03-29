import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RawEditorSettings } from 'tinymce';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  @Input() placeholder: string;
  @Input() control: FormControl;
  @Input() label: string = '';

  focus: boolean = false;

  settings: RawEditorSettings = {
    height: 250,
    menubar: false,
    entity_encoding: 'raw',
    setup: (editor) => {
      editor.on('focusin', () => {
        this.focus = true;
      });
      editor.on('focusout', () => {
        this.focus = false;
      });
      editor.on('init', () => {
        if (this.control.disabled) {
          this.control.disable();
        } else {
          this.control.enable();
        }
      });
    },
    plugins: ['autolink lists link'],
    toolbar:
      'undo redo | bold italic underline strikethrough | \
      bullist numlist | link',
    elementpath: false,
  };

  constructor() {}

  ngOnInit(): void {}
}
