import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-crag-comments',
  templateUrl: './crag-comments.component.html',
  styleUrls: ['./crag-comments.component.scss']
})
export class CragCommentsComponent implements OnInit {

  @Input() crag: any;

  constructor() { }

  ngOnInit(): void {
  }

}
