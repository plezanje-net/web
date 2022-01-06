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
    return this.authService.getCurrentUser().then((user) => {
      if (!user) {
        this.authService.openLogin$.next({
          returnUrl: state.url,
          message:
            'Možnost, ki ste jo izbrali, je dostopna samo registriranim uporabnikom. Zanadaljevanje se morate prijaviti.',
        });
      }
      return user != null;
    });
  }
}
