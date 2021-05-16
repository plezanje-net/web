import { Component, OnDestroy, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { GraphQLError } from 'graphql';
import { Subscription } from 'rxjs';

import { LayoutService } from 'src/app/services/layout.service';
import { DataError } from 'src/app/types/data-error';

const GET_MY_CLUBS = gql`
  {
    myClubs {
      id
      name
    }
  }
`;

@Component({
  selector: 'app-clubs',
  templateUrl: './clubs.component.html',
  styleUrls: ['./clubs.component.scss'],
})
export class ClubsComponent implements OnInit, OnDestroy {
  myClubs: any = [];
  querySubscription: Subscription;
  loading = true;
  error: DataError = null;

  constructor(private apollo: Apollo, private layoutService: LayoutService) {}

  ngOnInit(): void {
    this.querySubscription = this.apollo
      .watchQuery({
        query: GET_MY_CLUBS,
      })
      .valueChanges.subscribe((result: any) => {
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

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
