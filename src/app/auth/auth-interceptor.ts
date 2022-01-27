import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';

import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { GraphQLError } from 'graphql';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next.handle(request).pipe(
        tap((event) => {
          if (event instanceof HttpResponse && event.body.errors != null) {
            this.checkForTokenExpiredError(event.body.errors);
          }
        })
      );
    }

    return next.handle(request);
  }

  checkForTokenExpiredError(errors: GraphQLError[]) {
    if (errors.find((e) => e.message == 'token_expired')) {
      this.authService.logout().then(() => {
        this.snackbar.open(
          'Zaradi spremmebe v uporabniškem računu se moraš ponovno prijavit',
          null,
          { duration: 3000 }
        );
        this.router.navigate(['/']);
      });
    }
  }
}
