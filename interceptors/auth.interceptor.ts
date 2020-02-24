import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie';
import { CookieUtil } from '../login/cookie-util';

// import { Config } from '../shared/config/env.config';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // if (Config.ENV.toLowerCase() === 'dev') {
    //   req = req.clone({withCredentials: true});
    // }
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err instanceof HttpErrorResponse) {
          if (this.isUnauthorized(err.status)) {
            // console.warn('removeCookieAndRelogin - auth.interceptor.ts 33');
            CookieUtil.removeCookieAndRelogin(this.cookieService);

            if (err.error instanceof Error) {
              // A client-side or network error occurred. Handle it accordingly.
              console.error('An error occurred:', err.error.message);
              return throwError(err);
            } else {
              // The backend returned an unsuccessful response code.
              // The response body may contain clues as to what went wrong,
              console.error(`Backend returned code ${err.status}, body was: ${err.error}`);
              return throwError(err);
            }
          } else {
            return throwError(err);
          }
        }
        return throwError(err);
        // return Observable.of(null); // should never reach here...
      })
    );
    // .map((event: HttpEvent<any>) => {
    //     if (event instanceof HttpResponse) {
    //         // do stuff with response if you want
    //     }
    // })

  }

  private isUnauthorized(status: number): boolean {
    return status === 401 || status === 403;
  }

}
