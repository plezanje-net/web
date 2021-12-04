import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Comment, User } from 'src/generated/graphql';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit, OnChanges {
  @Input() comment: Comment;
  @Input() commentType: string;

  isAuthor = false;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.isAuthor =
      this.authService.currentUser &&
      this.comment.user &&
      this.comment.user.id == this.authService.currentUser.id;
  }
}
