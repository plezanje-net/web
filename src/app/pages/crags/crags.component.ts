import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-crags',
  templateUrl: './crags.component.html',
  styleUrls: ['./crags.component.scss']
})
export class CragsComponent implements OnInit {

  constructor(private layoutService: LayoutService) { }

  ngOnInit(): void {
    this.layoutService.$breadcrumbs.next([
      {
        name: "Plezališča"
      }
    ])
  }
}
