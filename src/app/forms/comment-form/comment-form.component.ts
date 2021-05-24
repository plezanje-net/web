import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Apollo, gql } from 'apollo-angular';
import {
  Comment,
  Crag,
  CreateCommentGQL,
  UpdateCommentGQL,
  IceFall,
  namedOperations,
  Peak,
  Route,
} from 'src/generated/graphql';

export interface DialogData {
  comment?: Comment;
  type?: string;
  iceFall?: IceFall;
  route?: Route;
  crag?: Crag;
  peak?: Peak;
}

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss'],
})
export class CommentFormComponent implements OnInit {
  title: string;

  loading = false;

  commentForm = new FormGroup({
    content: new FormControl(),
  });

  constructor(
    public dialogRef: MatDialogRef<CommentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private snackbar: MatSnackBar,
    private apollo: Apollo,
    private createCommentGQL: CreateCommentGQL,
    private updateCommentGQL: UpdateCommentGQL
  ) {}

  ngOnInit(): void {
    if (this.data.comment != null) {
      this.title = 'Uredi komentar';
      this.commentForm.patchValue({ content: this.data.comment.content });
    }

    if (this.data.type == 'warning') {
      this.title = 'Dodaj opozorilo';
    }

    if (this.data.type == 'condition') {
      this.title = 'Dodaj informacijo o razmerah';
    }

    if (this.data.type == 'comment') {
      this.title = 'Dodaj komentar';
    }
  }

  save() {
    this.loading = false;
    this.commentForm.disable();

    if (this.data.comment != undefined) {
      this.updateComment();
    } else {
      this.createComment();
    }
  }

  createComment() {
    const value = {
      content: this.commentForm.value.content,
      type: this.data.type,
      iceFallId: this.data.iceFall ? this.data.iceFall.id : null,
      routeId: this.data.route ? this.data.route.id : null,
      cragId: this.data.crag ? this.data.crag.id : null,
      peakId: this.data.peak ? this.data.peak.id : null,
    };

    this.createCommentGQL
      .mutate(
        { input: value },
        { refetchQueries: [namedOperations.Query.CragBySlug] }
      )
      .subscribe(
        (result: any) => {
          this.loading = false;
          this.dialogRef.close(result);
        },
        (error) => {
          this.loading = false;
          this.commentForm.enable();
          this.snackbar.open('Komentarja ni bilo mogoče objaviti', null, {
            panelClass: 'error',
            duration: 3000,
          });
        }
      );
  }

  updateComment() {
    const value = {
      id: this.data.comment.id,
      content: this.commentForm.value.content,
    };

    this.updateCommentGQL
      .mutate(
        { input: value },
        { refetchQueries: [namedOperations.Query.CragBySlug] }
      )
      .subscribe(
        (result: any) => {
          this.loading = false;
          this.dialogRef.close(result);
        },
        (error) => {
          this.loading = false;
          this.commentForm.enable();
          this.snackbar.open('Komentarja ni bilo mogoče shraniti', null, {
            panelClass: 'error',
            duration: 3000,
          });
        }
      );
  }
}
