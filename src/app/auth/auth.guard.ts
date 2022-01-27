import { Injectable } from '@angular/core';
import {
  CanActivate,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if (!this.authService.currentUser.value) {
      this.authService.openLogin$.next({
        returnUrl: state.url,
        message:
          'Stran je dostopna samo registriranim uporabnikom. Za nadaljevanje se moraš prijaviti.',
      });

      return false;
    }

    return true;
  }
}
