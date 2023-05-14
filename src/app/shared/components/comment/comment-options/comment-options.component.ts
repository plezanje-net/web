import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

import {
  Comment,
  DeleteCommentGQL,
  namedOperations,
} from 'src/generated/graphql';
import { CommentFormComponent } from '../../comment-form/comment-form.component';
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
    this.authService.guardedAction({}).then((success) => {
      if (success) {
        this.dialog
          .open(CommentFormComponent, {
            data: {
              comment: this.comment,
            },
            autoFocus: false,
          })
          .afterClosed()
          .subscribe(() => {});
      }
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
              {
                refetchQueries: [
                  namedOperations.Query.CragBySlug,
                  namedOperations.Query.IceFallBySlug,
                  namedOperations.Query.LatestComments,
                ],
              }
            )
            .pipe(take(1))
            .subscribe({
              error: () => {
                this.snackbar.open(
                  'Komentarja ni bilo mogoče odstraniti',
                  null,
                  {
                    panelClass: 'error',
                    duration: 3000,
                  }
                );
              },
            });
        }
      });
  }
}
