import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(private layoutService: LayoutService) { }

  ngOnInit(): void {
    this.layoutService.$breadcrumbs.next([
      {
        name: "Napaka"
      }
    ])
  }

}
