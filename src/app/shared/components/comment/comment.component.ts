import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Comment } from 'src/generated/graphql';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit, OnDestroy {
  @Input() comment: Comment;
  @Input() commentType: string;

  isAuthor = false;

  authSub: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authSub = this.authService.currentUser.subscribe(
      (user) =>
        (this.isAuthor =
          user != null &&
          this.comment.user != null &&
          this.comment.user.id == user.id)
    );
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
}
