import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { ClubFormComponent } from 'src/app/forms/club-form/club-form.component';
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
  myClubsQuery: QueryRef<any>;
  myClubsSubscription: Subscription;

  constructor(
    private layoutService: LayoutService,
    private myClubsGQL: MyClubsGQL,
    private dialog: MatDialog
  ) {}

  // TODO: make two lists?: clubs you are admin of, clubs you are a member of

  ngOnInit(): void {
    this.myClubsQuery = this.myClubsGQL.watch();
    this.myClubsSubscription = this.myClubsQuery.valueChanges.subscribe(
      (result: any) => {
        this.loading = false;
        if (result.errors != null) {
          this.error = {
            message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
          };
        } else {
          this.querySuccess(result.data);
        }
      }
    );
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

  createClub() {
    this.dialog
      .open(ClubFormComponent)
      .afterClosed()
      .subscribe(() => {
        this.myClubsQuery.refetch();
      });
  }

  ngOnDestroy() {
    this.myClubsSubscription.unsubscribe();
  }
}
