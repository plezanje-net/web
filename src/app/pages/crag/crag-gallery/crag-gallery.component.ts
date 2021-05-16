import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-crag-gallery',
  templateUrl: './crag-gallery.component.html',
  styleUrls: ['./crag-gallery.component.scss'],
})
export class CragGalleryComponent implements OnInit {
  @Input() images: string;

  storageUrl = environment.storageUrl;

  constructor() {}

  ngOnInit(): void {}
}
