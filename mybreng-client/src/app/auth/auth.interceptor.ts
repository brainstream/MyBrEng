import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpEventType,
  HttpUserEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, Subject, catchError, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './login';
import { AuthService } from './auth.service';
import { Queue } from '@app/shared';


interface SuspendedRequest {
  readonly httpHandler: HttpHandler;
  readonly request: HttpRequest<any>;
  readonly responseHandler$: Subject<HttpEvent<any>>;
}


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authenticationRequested = false;
  private readonly requestQueue = new Queue<SuspendedRequest>();

  constructor(
    private readonly auth: AuthService,
    private readonly dialog: MatDialog
  ) {
    auth.authenticated.subscribe((ok) => {
      if (ok) {
        this.authenticationRequested = false;
        this.resendAll();
      }
    });
  }

  private resendAll(): void {
    while (!this.requestQueue.empty) {
      const req = this.requestQueue.pop();
      if (req) {
        this.resend(req);
      }
    }
  }

  private resend(req: SuspendedRequest): void {
    req.httpHandler.handle(req.request).subscribe((response) => {
      req.responseHandler$.next(response);
    });
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const request = req.clone({ withCredentials: true });
    if (this.isLoginRequest(request)) {
        return next.handle(request);
    }
    if (this.authenticationRequested) {
        return this.suspendRequest(request, next);
    }
    return next.handle(request).pipe(
        catchError((err) => {
            if (err instanceof HttpErrorResponse && err.status == 401) {
                this.requestAuthentication();
                return this.suspendRequest(request, next);
            }
            return of(err);
        })
    );
  }

  private isLoginRequest(request: HttpRequest<unknown>): boolean {
    return request.method === 'POST' && request.url.endsWith('/account/login');
  }

  private suspendRequest(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.method !== 'GET') {
      return of({
        type: HttpEventType.User,
        ok: false,
      } as HttpUserEvent<any>);
    }
    const handler = new Subject<HttpEvent<any>>();
    this.requestQueue.push({
      httpHandler: next,
      request: req,
      responseHandler$: handler,
    });
    return handler.asObservable();
  }

  private requestAuthentication(): void {
    if (this.authenticationRequested) {
      return;
    }
    this.authenticationRequested = true;
    this.dialog.open(LoginComponent, {
      disableClose: true,
      minWidth: '400px',
      autoFocus: 'first-tabbable',
      backdropClass: 'solid'
    });
  }
}
