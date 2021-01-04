import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-crag-info',
  templateUrl: './crag-info.component.html',
  styleUrls: ['./crag-info.component.scss']
})
export class CragInfoComponent implements OnInit {

  @Input() crag: any;

  constructor() { }

  ngOnInit(): void {
  }

}
