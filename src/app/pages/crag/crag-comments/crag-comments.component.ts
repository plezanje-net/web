import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Crag, User } from 'src/generated/graphql';

@Component({
  selector: 'app-crag-comments',
  templateUrl: './crag-comments.component.html',
  styleUrls: ['./crag-comments.component.scss']
})
export class CragCommentsComponent implements OnInit {

  @Input() crag: Crag;
  @Input() action: Subject<string>;

  constructor() { }

  ngOnInit(): void { }

}
