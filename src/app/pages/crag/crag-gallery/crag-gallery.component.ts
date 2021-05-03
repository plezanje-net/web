import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Crag } from 'src/generated/graphql';

@Component({
  selector: 'app-crag-gallery',
  templateUrl: './crag-gallery.component.html',
  styleUrls: ['./crag-gallery.component.scss'],
})
export class CragGalleryComponent implements OnInit {
  @Input() crag: Crag;

  storageUrl = environment.storageUrl;

  constructor() {}

  ngOnInit(): void {}
}
