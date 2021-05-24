import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Crag } from 'src/generated/graphql';

@Component({
  selector: 'app-crag-location',
  templateUrl: './crag-location.component.html',
  styleUrls: ['./crag-location.component.scss'],
})
export class CragLocationComponent implements OnInit {
  @Input() crag: Crag;

  @Input() id: string = 'default';

  crags$ = new BehaviorSubject<any>([]);

  constructor() {}

  ngOnInit(): void {
    this.crags$.next([this.crag]);
  }
}
