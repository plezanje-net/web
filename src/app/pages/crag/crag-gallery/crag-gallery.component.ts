import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-crag-gallery',
  templateUrl: './crag-gallery.component.html',
  styleUrls: ['./crag-gallery.component.scss']
})
export class CragGalleryComponent implements OnInit {

  @Input() crag: any;

  constructor() { }

  ngOnInit(): void {
  }

}
