import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-crag-location',
  templateUrl: './crag-location.component.html',
  styleUrls: ['./crag-location.component.scss']
})
export class CragLocationComponent implements OnInit {

  @Input() crag: any;

  @Input() id: string = 'default';

  crags$ = new BehaviorSubject<any>([]);

  constructor() { }

  ngOnInit(): void {
    this.crags$.next([this.crag]);
  }

}
