import { Component, Input, OnInit } from '@angular/core';
import { Crag } from 'src/generated/graphql';

@Component({
  selector: 'app-crag-gallery',
  templateUrl: './crag-gallery.component.html',
  styleUrls: ['./crag-gallery.component.scss']
})
export class CragGalleryComponent implements OnInit {

  @Input() crag: Crag;

  constructor() { }

  ngOnInit(): void {
  }

}
