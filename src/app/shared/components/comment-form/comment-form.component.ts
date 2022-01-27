import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  maxDate?: Date;

  constructor(
    public dialogRef: MatDialogRef<CommentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private snackbar: MatSnackBar,
    private createCommentGQL: CreateCommentGQL,
    private updateCommentGQL: UpdateCommentGQL
  ) {}

  ngOnInit(): void {
    if (this.data.comment != null) {
      this.title = 'Uredi komentar';
      this.commentForm.patchValue({ content: this.data.comment.content });

      if (this.data.comment.type === 'warning') {
        this.addExposedUntilField();
        this.commentForm.patchValue({
          exposedUntil: this.data.comment.exposedUntil,
        });
      }
    }

    if (this.data.type == 'warning') {
      this.title = 'Dodaj opozorilo';

      this.addExposedUntilField();
    }

    if (this.data.type == 'condition') {
      this.title = 'Dodaj informacijo o razmerah';
    }

    if (this.data.type == 'comment') {
      this.title = 'Dodaj komentar';
    }
  }

  addExposedUntilField() {
    this.commentForm.addControl('exposedUntil', new FormControl());
    this.maxDate = new Date();
    this.maxDate.setMonth(this.maxDate.getMonth() + 1); // let user choose max 1 month validity of warning exposure
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
      exposedUntil:
        this.data.type === 'warning'
          ? this.commentForm.value.exposedUntil
          : null,
    };

    this.createCommentGQL
      .mutate(
        { input: value },
        {
          refetchQueries: [
            namedOperations.Query.CragBySlug,
            namedOperations.Query.IceFallBySlug,
          ],
        }
      )
      .subscribe({
        next: (result: any) => {
          this.loading = false;
          this.dialogRef.close(result);
        },
        error: () => {
          this.loading = false;
          this.commentForm.enable();
          this.snackbar.open('Komentarja ni bilo mogoče objaviti', null, {
            panelClass: 'error',
            duration: 3000,
          });
        },
      });
  }

  updateComment() {
    const value = {
      id: this.data.comment.id,
      content: this.commentForm.value.content,
      exposedUntil:
        this.data.comment.type === 'warning'
          ? this.commentForm.value.exposedUntil
          : null,
    };

    this.updateCommentGQL
      .mutate(
        { input: value },
        {
          refetchQueries: [
            namedOperations.Query.CragBySlug,
            namedOperations.Query.IceFallBySlug,
          ],
        }
      )
      .subscribe({
        next: (result: any) => {
          this.loading = false;
          this.dialogRef.close(result);
        },
        error: () => {
          this.loading = false;
          this.commentForm.enable();
          this.snackbar.open('Komentarja ni bilo mogoče shraniti', null, {
            panelClass: 'error',
            duration: 3000,
          });
        },
      });
  }
}
