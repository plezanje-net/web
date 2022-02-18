import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, take } from 'rxjs';
import { LoginRequest } from '../types/login-request';
import { Apollo } from 'apollo-angular';
import { GuardedActionOptions } from '../types/guarded-action-options';
import {
  LoginResponse,
  ProfileGQL,
  ProfileQuery,
  User,
} from 'src/generated/graphql';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  public openLogin$ = new Subject<LoginRequest>();

  constructor(private apollo: Apollo, private profileGQL: ProfileGQL) {}

  public initialize(): void {
    const authString = localStorage.getItem(this.getCookieName('auth'));
    if (authString) {
      const { user } = JSON.parse(authString);
      this.currentUser.next(user);
    }
  }

  logout(): Promise<any> {
    this.currentUser.next(null);
    localStorage.removeItem(this.getCookieName('auth'));
    return this.apollo.client.clearStore();
  }

  login(loginResponse: LoginResponse): Promise<any> {
    localStorage.setItem(
      this.getCookieName('auth'),
      JSON.stringify(loginResponse)
    );

    this.currentUser.next(loginResponse.user);

    return this.apollo.client.resetStore();
  }

  getToken(): string {
    const authString = localStorage.getItem(this.getCookieName('auth'));
    if (authString) {
      const { token } = JSON.parse(authString);
      return token;
    }

    return null;
  }

  getCookieName(type: string): string {
    return `plezanjenet-${type}`;
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
