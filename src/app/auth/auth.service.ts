import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { LoginRequest } from '../types/login-request';
import { Apollo } from 'apollo-angular';
import { GuardedActionOptions } from '../types/guarded-action-options';
import { LoginResponse, User } from 'src/generated/graphql';
import { LocalStorageService } from '../services/local-storage.service';
import dayjs from 'dayjs';

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

  async logout() {
    await this.apollo.client.clearStore(); // need to clear the cache first, because some queries get fetched right after logout completes
    this.localStorageService.removeItem('auth');
    this.currentUser.next(null); // only after cache is finished clearing can we emmit new user (because it might trigger some refetches)
  }

  async login(loginResponse: LoginResponse): Promise<any> {
    await this.apollo.client.resetStore();
    this.localStorageService.setItem(
      'auth',
      loginResponse,
      dayjs().add(1, 'year').toISOString()
    );

    this.currentUser.next(loginResponse.user);
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
