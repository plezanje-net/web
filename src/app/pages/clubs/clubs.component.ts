import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/services/layout.service';
import { DataError } from 'src/app/types/data-error';
import { Club, MyClubsGQL } from '../../../generated/graphql';

@Component({
  selector: 'app-clubs',
  templateUrl: './clubs.component.html',
  styleUrls: ['./clubs.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ClubsComponent implements OnInit, OnDestroy {
  myClubs: Club[] = [];
  loading = true;
  error: DataError = null;
  myClubsSubscription: Subscription;

  constructor(
    private layoutService: LayoutService,
    private myClubsGQL: MyClubsGQL
  ) {}

  ngOnInit(): void {
    this.myClubsGQL.watch().valueChanges.subscribe((result: any) => {
      this.loading = false;
      if (result.errors != null) {
        this.error = {
          message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
        };
      } else {
        this.querySuccess(result.data);
      }
    });
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
    if (this.myClubsSubscription) this.myClubsSubscription.unsubscribe();
  }
}
