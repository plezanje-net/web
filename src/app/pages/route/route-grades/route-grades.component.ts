import { Component, Input } from '@angular/core';

interface IGrade {
  user: {
    firstname: string;
    lastname: string;
  };
  grade: number;  // TODO difficulty instead of grade
  created: string;
  updated: string;
}

@Component({
  selector: 'app-route-grades',
  templateUrl: './route-grades.component.html',
  styleUrls: ['./route-grades.component.scss']
})
export class RouteGradesComponent {

  @Input() grades: IGrade[] = [];
  @Input() difficulty: string;

  constructor() { }
}
