import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/auth.service';
import { CommentFormComponent } from 'src/app/forms/comment-form/comment-form.component';
import {
  Comment,
  DeleteCommentGQL,
  namedOperations,
} from 'src/generated/graphql';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-comment-options',
  templateUrl: './comment-options.component.html',
  styleUrls: ['./comment-options.component.scss'],
})
export class CommentOptionsComponent implements OnInit {
  @Input() comment: Comment;

  constructor(
    private deleteCommentGQL: DeleteCommentGQL,
    private dialog: MatDialog,
    private authService: AuthService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  edit() {
    this.authService.guardedAction({}).then(() => {
      this.dialog
        .open(CommentFormComponent, {
          data: {
            comment: this.comment,
          },
          autoFocus: false,
        })
        .afterClosed()
        .subscribe(() => {});
    });
  }

  remove() {
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          message: 'Pobrišem komentar?',
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result != null) {
          this.deleteCommentGQL
            .mutate(
              { id: this.comment.id },
              { refetchQueries: [namedOperations.Query.CragBySlug] }
            )
            .toPromise()
            .catch(() => {
              this.snackbar.open('Komentarja ni bilo mogoče odstraniti', null, {
                panelClass: 'error',
                duration: 3000,
              });
            });
        }
      });
  }
}
