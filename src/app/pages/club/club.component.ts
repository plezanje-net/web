import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { GraphQLError } from 'graphql';
import { ClubMemberFormComponent } from 'src/app/forms/club-member-form/club-member-form.component';
import { LayoutService } from 'src/app/services/layout.service';
import { DataError } from 'src/app/types/data-error';
import { Club, ClubByIdGQL, ClubMember } from 'src/generated/graphql';
import { QueryRef } from 'apollo-angular';
import { AuthService } from 'src/app/auth/auth.service';
import { ClubService } from './club.service';

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.scss'],
  providers: [ClubService],
})
export class ClubComponent implements OnInit {
  loading = true;
  error: DataError = null;

  club: Club;
  amClubAdmin = false;

  clubQuery: QueryRef<any>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private authService: AuthService,
    private dialog: MatDialog,
    private clubByIdGQL: ClubByIdGQL,
    private clubService: ClubService
  ) {}

  ngOnInit(): void {
    const clubId = this.activatedRoute.snapshot.params.club;
    this.clubQuery = this.clubByIdGQL.watch({ clubId: clubId });

    this.clubQuery.valueChanges.subscribe((data: any) => {
      this.loading = false;
      if (data.errors != null) {
        this.queryError(data.errors);
        return;
      }

      this.club = data.data.club;
      this.clubService.club$.next(this.club);

      this.setBreadcrumbs();

      this.amClubAdmin = this.club.members.some(
        (member: ClubMember) =>
          member.user.id === this.authService.currentUser.id && member.admin
      );
    });
  }

  queryError(errors: GraphQLError[]) {
    // TODO:handle errors
  }

  setBreadcrumbs() {
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

  addMember() {
    this.dialog
      .open(ClubMemberFormComponent, {
        data: { clubId: this.club.id, clubName: this.club.name },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.clubQuery.refetch();
          this.clubService.memberAdded$.next();
        }
      });
  }
}
