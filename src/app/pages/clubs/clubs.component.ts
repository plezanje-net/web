import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LayoutService } from 'src/app/services/layout.service';
import { DataError } from 'src/app/types/data-error';
import { GraphQLError } from 'graphql';
import { Club, MyClubsGQL } from '../../../generated/graphql';

// TODO: finish clubs list layout... add club logo/avatar do db? or drop avatar altogether...
// TODO: display message if you have no clubs
// TODO: handle and display error

@Component({
  selector: 'app-clubs',
  templateUrl: './clubs.component.html',
  styleUrls: ['./clubs.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ClubsComponent implements OnInit {
  myClubs: Club[] = [];

  loading = true;
  error: DataError = null;

  constructor(
    private layoutService: LayoutService,
    private myClubsGQL: MyClubsGQL
  ) {}

  ngOnInit(): void {
    this.myClubsGQL.fetch().subscribe((result: any) => {
      this.loading = false;
      if (result.errors != null) {
        this.queryError(result.errors);
      } else {
        this.querySuccess(result.data);
      }
    });
  }

  queryError(errors: GraphQLError[]) {
    this.error = {
      message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
    };
  }

  querySuccess(data: any) {
    this.myClubs = data.myClubs;

    this.layoutService.$breadcrumbs.next([
      {
        name: 'Moj Profil',
        path: '/moj-profil',
      },
      {
        name: 'Moji Klubi',
      },
    ]);
  }
}
