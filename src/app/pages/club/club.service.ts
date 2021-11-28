import { Injectable, OnDestroy } from '@angular/core';
import { QueryRef } from 'apollo-angular';
import { BehaviorSubject, ReplaySubject, Subject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Club, ClubBySlugGQL, ClubMember } from 'src/generated/graphql';

@Injectable()
export class ClubService implements OnDestroy {
  private club = new ReplaySubject<Club>(1); // source
  club$ = this.club.asObservable(); // stream
  memberAdded$ = new Subject<void>();

  amClubAdmin = new BehaviorSubject<boolean>(false);
  amClubAdmin$ = this.amClubAdmin.asObservable();

  clubQuery: QueryRef<any>;
  clubQuerySubscription: Subscription;

  constructor(
    private clubBySlugGQL: ClubBySlugGQL,
    private authService: AuthService
  ) {}

  fetchClub(clubSlug: string) {
    this.clubQuery = this.clubBySlugGQL.watch({ clubSlug });
    this.clubQuerySubscription = this.clubQuery.valueChanges.subscribe(
      (data) => {
        if (data.errors != null) {
          this.club.error(data.errors);
        } else {
          const club = data.data.clubBySlug;
          const amClubAdmin = club.members.some(
            (member: ClubMember) =>
              member.user.id === this.authService.currentUser.id && member.admin
          );
          this.amClubAdmin.next(amClubAdmin);
          this.club.next(club);
        }
      }
    );
  }

  refetchClub() {
    this.clubQuery.refetch();
  }

  ngOnDestroy() {
    this.clubQuerySubscription.unsubscribe();
  }
}
