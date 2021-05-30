import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Club } from 'src/generated/graphql';

@Injectable()
export class ClubService {
  club$ = new BehaviorSubject<Club>(null);
  memberAdded$ = new Subject<void>();

  constructor() {}
}
