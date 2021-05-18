import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/services/layout.service';
import { DataError } from 'src/app/types/data-error';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {
  error: DataError = {
    message: 'Iskane strani ni bilo mogoče najti.',
  };

  constructor(private layoutService: LayoutService) {}

  ngOnInit(): void {
    this.layoutService.$breadcrumbs.next([
      {
        name: 'Napaka',
      },
    ]);
  }
}
