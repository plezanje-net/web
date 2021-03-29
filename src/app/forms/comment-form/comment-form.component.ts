import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  type: string
}

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent implements OnInit {

  title: string;

  loading = false;

  commentForm = new FormGroup({
    content: new FormControl()
  })

  constructor(
    public dialogRef: MatDialogRef<CommentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngOnInit(): void {
    if (this.data.type == "warning") {
      this.title = "Dodaj opozorilo"
    }

    if (this.data.type == "condition") {
      this.title = "Dodaj informacijo o razmerah"
    }

    if (this.data.type == "comment") {
      this.title = "Dodaj komentar"
    }
  }

  save() {

  }

}
