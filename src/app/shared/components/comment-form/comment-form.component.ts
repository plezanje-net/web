import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import dayjs from 'dayjs';
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
    type: new FormControl(),
    content: new FormControl(),
  });

  minDate = new Date();
  maxDate?: Date;

  constructor(
    public dialogRef: MatDialogRef<CommentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private snackbar: MatSnackBar,
    private createCommentGQL: CreateCommentGQL,
    private updateCommentGQL: UpdateCommentGQL
  ) {}

  ngOnInit(): void {
    if (this.data.type) {
      this.commentForm.patchValue({
        type: this.data.type,
      });
    }

    this.updateFormType();

    if (this.data.comment != null) {
      this.commentForm.patchValue({
        content: this.data.comment.content,
        type: this.data.comment.type,
      });
    }
  }

  updateFormType() {
    switch (this.type) {
      case 'comment':
        if (this.data.comment != null) {
          this.title = 'Uredi komentar';
        } else {
          this.title = 'Dodaj komentar';
        }

        this.removeExposedUntilField();
        break;
      case 'warning':
        if (this.data.comment != null) {
          this.title = 'Uredi opozorilo';
        } else {
          this.title = 'Dodaj opozorilo';
        }

        this.addExposedUntilField();
        if (this.data.comment != null) {
          this.commentForm.patchValue({
            exposedUntil: this.data.comment.exposedUntil,
          });
        }
        break;
    }
  }

  addExposedUntilField() {
    this.commentForm.addControl('exposedUntil', new FormControl(null));
    this.maxDate = new Date();
    this.maxDate.setMonth(this.maxDate.getMonth() + 1); // let user choose max 1 month validity of warning exposure
  }

  removeExposedUntilField() {
    this.commentForm.removeControl('exposedUntil');
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
      type: this.type,
      iceFallId: this.data.iceFall ? this.data.iceFall.id : null,
      routeId: this.data.route ? this.data.route.id : null,
      cragId: this.data.crag ? this.data.crag.id : null,
      peakId: this.data.peak ? this.data.peak.id : null,
      exposedUntil:
        this.type === 'warning' && this.commentForm.value.exposedUntil
          ? dayjs(this.commentForm.value.exposedUntil).format('YYYY-MM-DD')
          : null,
    };

    this.createCommentGQL
      .mutate(
        { input: value },
        {
          refetchQueries: [
            //TODO: some of these queries might not be active and trying to refetch them causes apollo warnings
            namedOperations.Query.CragBySlug,
            namedOperations.Query.IceFallBySlug,
            namedOperations.Query.RouteBySlug,
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

  get type(): string {
    return this.commentForm.value.type;
  }
}
