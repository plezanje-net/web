import { Component, OnInit, Input } from '@angular/core';

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
  selector: 'app-route-comments',
  templateUrl: './route-comments.component.html',
  styleUrls: ['./route-comments.component.scss'],
})
export class RouteCommentsComponent {
  allComments: IComment[];
  regularComments: IComment[];
  conditions: IComment[];
  warnings: IComment[];
  descriptions: IComment[];

  @Input() set comments(comments: IComment[]) {
    this.allComments = comments;

    this.regularComments = [];
    this.conditions = [];
    this.warnings = [];
    this.descriptions = [];

    this.allComments.forEach((comment) => {
      if (comment.type === 'condition') {
        this.conditions.push(comment);
      } else if (comment.type === 'warning') {
        this.warnings.push(comment);
      } else if (comment.type === 'description') {
        this.descriptions.push(comment);
      } else {
        this.regularComments.push(comment);
      }
    });
  }

  get comments(): IComment[] {
    return this.allComments;
  }

  constructor() {}
}
