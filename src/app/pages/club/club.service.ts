import { Injectable, OnDestroy } from '@angular/core';
import { QueryRef } from 'apollo-angular';
import {
  BehaviorSubject,
  concatMap,
  map,
  mergeMap,
  ReplaySubject,
  Subject,
  Subscription,
  switchMap,
  toArray,
} from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import {
  Club,
  ClubBySlugGQL,
  ClubBySlugQuery,
  ClubMember,
  User,
} from 'src/generated/graphql';

interface MapOutput {
  user: User;
  data: ClubBySlugQuery;
}

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

    // use switchmap with current user

    this.clubQuerySubscription = this.clubQuery.valueChanges
      .pipe(
        switchMap((data) =>
          this.authService.currentUser.pipe(
            map((user) => ({ user: user, data: data }))
          )
        )
      )
      .subscribe({
        next: ({ data, user }) => {
          if (data.errors != null || user == null) {
            this.club.error(data.errors);
          } else {
            const club = data.data.clubBySlug;
            const amClubAdmin = club.members.some(
              (member: ClubMember) => member.user.id === user.id && member.admin
            );
            this.amClubAdmin.next(amClubAdmin);
            this.club.next(club);
          }
        },
      });
  }

  refetchClub() {
    this.clubQuery.refetch();
  }

  ngOnDestroy() {
    this.clubQuerySubscription.unsubscribe();
  }
}
