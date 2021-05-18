import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  @Input() placeholder: string;
  @Input() control: FormControl;

  focus: boolean = false;

  settings = {
    height: 250,
    menubar: false,
    setup: (editor) => {
      editor.on('focusin', () => {
        this.focus = true;
      });
      editor.on('focusout', () => {
        this.focus = false;
      });
    },
    plugins: ['autolink lists link'],
    toolbar:
      'undo redo | bold italic underline strikethrough | \
      bullist numlist | link',
  };

  constructor() {}

  ngOnInit(): void {}
}
