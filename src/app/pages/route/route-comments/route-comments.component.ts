import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
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
  selector: 'app-route-comments',
  templateUrl: './route-comments.component.html',
  styleUrls: ['./route-comments.component.scss'],
})
export class RouteCommentsComponent implements AfterViewInit {
  allComments: IComment[];
  regularComments: IComment[];
  conditions: IComment[];
  descriptions: IComment[];
  showNoCommentsMessage = false;

  @Output() onViewInit = new EventEmitter<void>();
  @Input() action$: Subject<string>;
  @Input() previewMode: boolean = false;
  @Input() set comments(comments: IComment[]) {
    this.allComments = comments;

    this.regularComments = [];
    this.conditions = [];
    this.descriptions = [];

    this.allComments.forEach((comment) => {
      if (comment.type === 'condition') {
        this.conditions.push(comment);
      } else if (comment.type === 'description') {
        this.descriptions.push(comment);
      } else if (comment.type === 'comment') {
        this.regularComments.push(comment);
      }
    });

    this.showNoCommentsMessage =
      this.conditions.length === 0 &&
      this.descriptions.length === 0 &&
      this.regularComments.length === 0;
  }

  get comments(): IComment[] {
    return this.allComments;
  }

  constructor() {}

  addComment() {
    this.action$.next('add-comment');
  }

  ngAfterViewInit(): void {
    // this is used when this component is a child of CragRoutePreviewComponent which measures the height after view init
    this.onViewInit.emit();
  }
}
