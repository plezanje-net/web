import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Comment, Crag, User } from 'src/generated/graphql';

@Component({
  selector: 'app-crag-comments',
  templateUrl: './crag-comments.component.html',
  styleUrls: ['./crag-comments.component.scss'],
})
export class CragCommentsComponent implements OnInit, OnChanges {
  @Input() crag: Crag;
  @Input() action: Subject<string>;

  comments: Comment[];
  conditions: Comment[];

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.comments = this.crag.comments.filter((c) => c.type == 'comment');
    this.conditions = this.crag.comments.filter((c) => c.type == 'condition');
  }
}
