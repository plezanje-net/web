import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-crag-warnings',
  templateUrl: './crag-warnings.component.html',
  styleUrls: ['./crag-warnings.component.scss']
})
export class CragWarningsComponent implements OnInit {

  @Input() crag: any;

  constructor() { }

  ngOnInit(): void {
  }

}
