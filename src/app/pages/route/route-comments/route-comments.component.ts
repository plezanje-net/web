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
  styleUrls: ['./route-comments.component.scss']
})
export class RouteCommentsComponent {

  @Input() comments: IComment[] = [];

  constructor() {}
}
