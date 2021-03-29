import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-crag-comments',
  templateUrl: './crag-comments.component.html',
  styleUrls: ['./crag-comments.component.scss']
})
export class CragCommentsComponent implements OnInit {

  @Input() crag: any;
  @Input() action: Subject<string>;

  constructor() { }

  ngOnInit(): void {
  }

}
