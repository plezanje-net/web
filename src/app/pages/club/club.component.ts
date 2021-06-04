import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { GraphQLError } from 'graphql';
import { ClubMemberFormComponent } from 'src/app/forms/club-member-form/club-member-form.component';
import { LayoutService } from 'src/app/services/layout.service';
import { DataError } from 'src/app/types/data-error';
import { Club } from 'src/generated/graphql';
import { ClubService } from './club.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.scss'],
  providers: [ClubService],
})
export class ClubComponent implements OnInit, OnDestroy {
  loading = true;
  error: DataError = null;

  club: Club;

  clubSubscription: Subscription;

  // TODO: move breadcrumbs to service?
  // TODO: add rename club to menu

  constructor(
    private activatedRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private dialog: MatDialog,
    public clubService: ClubService
  ) {}

  ngOnInit(): void {
    const clubId = this.activatedRoute.snapshot.params.club;
    this.clubService.fetchClub(clubId);
    this.clubSubscription = this.clubService.club$.subscribe(
      (club: Club) => {
        if (!club) return;
        this.loading = false;
        this.club = club;
        this.setBreadcrumbs();
      },
      (errors) => {
        this.loading = false;
        this.queryError(errors);
      }
    );
  }

  queryError(errors: GraphQLError[]) {
    if (
      errors.length > 0 &&
      errors[0].message.startsWith('Could not find any entity of type')
    ) {
      this.error = {
        message: 'Klub ne obstaja.',
      };
    } else if (errors.length > 0 && errors[0].message === 'Forbidden') {
      this.error = {
        message:
          'Nisi član kluba, zato nimaš pravic za prikaz podatkov o klubu.',
      };
    } else {
      this.error = {
        message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
      };
    }
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
          this.clubService.refetchClub();
          this.clubService.memberAdded$.next();
        }
      });
  }

  ngOnDestroy() {
    if (this.clubSubscription) this.clubSubscription.unsubscribe();
  }
}
