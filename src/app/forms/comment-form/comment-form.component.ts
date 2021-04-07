import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Apollo, gql } from 'apollo-angular';

export interface DialogData {
  iceFall: any
  route: any
  crag: any
  peak: any
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
    private snackbar: MatSnackBar,
    private apollo: Apollo
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

    this.loading = false;
    this.commentForm.disable();

    const value = {
      content: this.commentForm.value.content,
      type: this.data.type,
      iceFallId: this.data.iceFall ? this.data.iceFall.id : null,
      routeId: this.data.route ? this.data.route.id : null,
      cragId: this.data.crag ? this.data.crag.id : null,
      peakId: this.data.peak ? this.data.peak.id : null
    }

    this.apollo.mutate({
      mutation: gql`
        mutation {
          createComment(input: {
            content: "${value.content}",
            type: "${value.type}",
            iceFallId: "${value.iceFallId}",
            routeId: "${value.routeId}",
            cragId: "${value.cragId}",
            peakId: "${value.peakId}",
          }) {
            id
          }
        }
      `
    }).subscribe((result: any) => {
      this.loading = false;
      this.dialogRef.close(result);
    }, (error) => {
      this.loading = false;
      this.commentForm.enable();
      this.snackbar.open("Komentarja ni bilo mogoče objaviti", null, { panelClass: "error", duration: 3000 });
    })

  }

}
