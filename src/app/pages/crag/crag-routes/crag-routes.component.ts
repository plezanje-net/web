import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-crag-routes',
  templateUrl: './crag-routes.component.html',
  styleUrls: ['./crag-routes.component.scss']
})
export class CragRoutesComponent implements OnInit {

  @Input() crag: any;

  constructor() { }

  ngOnInit(): void {
  }

}
