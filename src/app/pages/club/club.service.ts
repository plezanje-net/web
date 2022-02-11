import { Injectable, OnDestroy } from '@angular/core';
import { QueryRef } from 'apollo-angular';
import {
  BehaviorSubject,
  map,
  ReplaySubject,
  Subject,
  Subscription,
  switchMap,
} from 'rxjs';
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

  private error = new Subject<Error>();
  error$ = this.error.asObservable();

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
          if (user == null) {
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
        error: (error) => {
          this.club.error(error);
        },
      });
  }

  refetchClub(slug = null) {
    if (slug) {
      this.clubQuery.refetch({ clubSlug: slug });
    } else {
      this.clubQuery.refetch();
    }
  }

  emitError(error: Error) {
    this.error.next(error);
  }

  ngOnDestroy() {
    this.clubQuerySubscription.unsubscribe();
  }
}
