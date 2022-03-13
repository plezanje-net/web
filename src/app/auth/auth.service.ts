import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, take } from 'rxjs';
import { LoginRequest } from '../types/login-request';
import { Apollo } from 'apollo-angular';
import { GuardedActionOptions } from '../types/guarded-action-options';
import { LoginResponse, User } from 'src/generated/graphql';
import { LocalStorageService } from '../services/local-storage.service';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  public openLogin$ = new Subject<LoginRequest>();

  constructor(
    private apollo: Apollo,
    private localStorageService: LocalStorageService
  ) {}

  public initialize(): void {
    const authData = this.localStorageService.getItem('auth');
    if (authData != null && authData.user) {
      this.currentUser.next(authData.user);
    }
  }

  logout(): Promise<any> {
    this.currentUser.next(null);
    this.localStorageService.removeItem('auth');
    return this.apollo.client.clearStore();
  }

  login(loginResponse: LoginResponse): Promise<any> {
    this.localStorageService.setItem(
      'auth',
      loginResponse,
      moment(new Date()).add(365, 'day').toISOString()
    );

    this.currentUser.next(loginResponse.user);

    return this.apollo.client.resetStore();
  }

  getToken(): string {
    const authData = this.localStorageService.getItem('auth');

    if (authData != null && authData.user) {
      return authData.token;
    }

    return null;
  }

  async guardedAction(options: GuardedActionOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.currentUser.value != null) {
        resolve(true);
        return;
      }

      const success = new Subject<any>();

      this.openLogin$.next({
        success: success,
        ...options,
      });

      success.subscribe((data) => {
        resolve(data);
      });
    });
  }
}
