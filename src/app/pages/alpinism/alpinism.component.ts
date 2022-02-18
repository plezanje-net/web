import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-alpinism',
  templateUrl: './alpinism.component.html',
  styleUrls: ['./alpinism.component.scss'],
})
export class AlpinismComponent implements OnInit {
  constructor(private layoutService: LayoutService) {}

  ngOnInit(): void {
    this.layoutService.$breadcrumbs.next([
      {
        name: 'Alpinizem',
      },
    ]);
  }
}
