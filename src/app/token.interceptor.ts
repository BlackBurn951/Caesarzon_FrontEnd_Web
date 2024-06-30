import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { KeyCloakService } from "./services/keyCloakService";
import { Observable, throwError } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private keyCloakService: KeyCloakService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.keyCloakService.getAccessToken();
    let clonedRequest = req;

    if (accessToken) {
      clonedRequest = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + accessToken)
      });
    }

    return next.handle(clonedRequest).pipe(
      catchError(err => {
        if (err.status === 401) {
          return this.keyCloakService.refreshToken().pipe(
            switchMap(() => {
              const newAccessToken = this.keyCloakService.getAccessToken();
              const newClonedRequest = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + newAccessToken)
              });
              return next.handle(newClonedRequest);
            })
          );
        }
        return throwError(err);
      })
    );
  }
}
