import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Crag } from 'src/generated/graphql';

@Component({
  selector: 'app-crag-image',
  templateUrl: './crag-image.component.html',
  styleUrls: ['./crag-image.component.scss'],
})
export class CragImageComponent implements OnInit {
  @Input() crag: Crag;

  constructor() {}

  ngOnInit(): void {}
}
