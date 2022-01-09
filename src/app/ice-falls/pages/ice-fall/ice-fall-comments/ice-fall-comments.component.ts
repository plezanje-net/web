import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

interface IComment {
  content: string;
  user: {
    firstname: string;
    lastname: string;
  };
  type: string;
  created: string;
}

@Component({
  selector: 'app-ice-fall-comments',
  templateUrl: './ice-fall-comments.component.html',
  styleUrls: ['./ice-fall-comments.component.scss'],
})
export class IceFallCommentsComponent {
  allComments: IComment[];
  regularComments: IComment[];
  conditions: IComment[];

  @Input() action: Subject<string>;

  @Input() set comments(comments: IComment[]) {
    this.allComments = comments;

    this.regularComments = [];
    this.conditions = [];

    this.allComments.forEach((comment) => {
      if (comment.type === 'condition') {
        this.conditions.push(comment);
      } else if (comment.type === 'comment') {
        this.regularComments.push(comment);
      }
    });
  }

  get comments(): IComment[] {
    return this.allComments;
  }

  constructor() {}
}
