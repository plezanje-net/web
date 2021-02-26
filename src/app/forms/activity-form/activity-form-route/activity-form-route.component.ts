import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-activity-form-route',
  templateUrl: './activity-form-route.component.html',
  styleUrls: ['./activity-form-route.component.scss']
})
export class ActivityFormRouteComponent implements OnInit {

  @Input() activity: boolean = true;
  @Input() route: FormGroup;
  @Input() first: boolean;
  @Input() last: boolean;
  @Output() move = new EventEmitter<number>();

  ascentTypes: any[] = [
    { value: "onsight", label: "Na pogled" },
    { value: "flash", label: "Flash" },
    { value: "redpoint", label: "Z rdečo piko" },
    { value: "allfree", label: "Vse prosto" },
    { value: "aid", label: "Tehnično plezanje" },
    { value: "attempt", label: "Neuspel poskus" }
  ];

  publishOptions: any[] = [
    { value: "public", label: "Objavi povsod" },
    { value: "club", label: "Samo za prijatelje" },
    { value: "log", label: "Javno na mojem profilu" },
    { value: "private", label: "Samo zame" },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
