import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  constructor(private layoutService: LayoutService) {}

  ngOnInit(): void {
    this.layoutService.$breadcrumbs.next([
      {
        name: 'O plezanje.net',
      },
    ]);
  }
}
