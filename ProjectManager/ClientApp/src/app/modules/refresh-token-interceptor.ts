/*import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { JwtInterceptor } from '@auth0/angular-jwt';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private jwtInterceptor: JwtInterceptor) {
    }

  /*  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.jwtInterceptor.isAllowedDomain(req) && !this.jwtInterceptor.isDisallowedRoute(req)) {
            return next.handle(req).pipe(
                catchError(err => {
                    const errorResponse = err as HttpErrorResponse;
                    const expiredHeader = errorResponse.headers.get('AccessToken-Expired') === 'true';

                    if (errorResponse.status === 401 && expiredHeader) {
                        return this.authenticationService.refreshToken.pipe(mergeMap(r  => {
                            if (!r.accessToken) {
                                this.authenticationService.logout();
                                location.reload();
                                return EMPTY;
                            } else {
                                return this.jwtInterceptor.intercept(req, next);
                            }
                        }));
                    } else {
                        this.authenticationService.logout();
                        location.reload();
                    }
                    return throwError(err);
                })
            ) as Observable<HttpEvent<any>>;
        } else {
            return next.handle(req);
        }
    }
}*/