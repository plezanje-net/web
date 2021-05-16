import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { GraphQLError } from 'graphql';
import { Subscription } from 'rxjs';

import { ClubMemberFormComponent } from 'src/app/forms/club-member-form/club-member-form.component';
import { LayoutService } from 'src/app/services/layout.service';
import { DataError } from 'src/app/types/data-error';

const GET_CLUB = gql`
  query getClub($clubId: String!) {
    club(id: $clubId) {
      id
      name
      members {
        admin
        user {
          id
          fullName
        }
      }
    }
  }
`;

// TODO: should be unable to get club data if I am not a member!

// TODO: should have nice url with no id, but slug

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.scss'],
})
export class ClubComponent implements OnInit, OnDestroy {
  club: any = {};
  loading = true;
  error: DataError = null;
  clubQuery: QueryRef<any>;
  querySubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apollo: Apollo,
    private layoutService: LayoutService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.clubQuery = this.apollo.watchQuery({
        query: GET_CLUB,
        variables: {
          clubId: params.club,
        },
      });
      this.querySubscription = this.clubQuery.valueChanges.subscribe(
        (result: any) => {
          this.loading = false;
          if (result.errors != null) {
            this.queryError(result.errors);
          } else {
            this.querySuccess(result.data);
          }
        }
      );
    });
  }

  queryError(errors: GraphQLError[]) {
    if (
      errors.length > 0 &&
      errors[0].message.startsWith('Could not find any entity of type')
    ) {
      this.error = {
        message: 'Klub ne obstaja.',
      };
      return;
    }

    this.error = {
      message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
    };
  }

  querySuccess(data: any) {
    this.club = data.club;
    console.log(this.club);
    this.layoutService.$breadcrumbs.next([
      {
        name: 'Moj Profil',
        path: '/moj-profil',
      },
      {
        name: 'Moji Klubi',
        path: '/moj-profil/moji-klubi',
      },
      {
        name: this.club.name,
      },
    ]);
  }

  // TODO: add option to remove a member

  addMember() {
    this.dialog
      .open(ClubMemberFormComponent, {
        data: { clubId: this.club.id, clubName: this.club.name },
      })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          this.clubQuery.refetch();
        }
      });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
