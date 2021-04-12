import { Component, Input, OnInit } from '@angular/core';
import { Crag } from 'src/generated/graphql';

@Component({
  selector: 'app-crag-info',
  templateUrl: './crag-info.component.html',
  styleUrls: ['./crag-info.component.scss']
})
export class CragInfoComponent implements OnInit {

  @Input() crag: Crag;

  constructor() { }

  ngOnInit(): void {
  }

}
