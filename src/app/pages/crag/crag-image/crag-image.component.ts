import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Crag } from 'src/generated/graphql';

@Component({
  selector: 'app-crag-image',
  templateUrl: './crag-image.component.html',
  styleUrls: ['./crag-image.component.scss'],
})
export class CragImageComponent implements OnInit {
  @Input() crag: Crag;

  storageUrl = environment.storageUrl;

  constructor() {}

  ngOnInit(): void {}
}
