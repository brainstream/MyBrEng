import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpEventType, HttpUserEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, Subject, catchError, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './login';
import { AuthService } from './auth.service';
import { Queue } from '@app/shared';

interface SuspendedRequest {
    readonly next: HttpHandlerFn;
    readonly request: HttpRequest<unknown>;
    readonly responseHandler$: Subject<HttpEvent<unknown>>;
}

let authenticationRequested = false;
const requestQueue = new Queue<SuspendedRequest>();

function resendAll(auth: AuthService): void {
    auth.authenticated.subscribe((ok) => {
        if (ok) {
            authenticationRequested = false;
            while (!requestQueue.empty) {
                const req = requestQueue.pop();
                if (req) {
                    req.next(req.request).subscribe((response) => {
                        req.responseHandler$.next(response);
                    });
                }
            }
        }
    });
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(AuthService);
    const dialog = inject(MatDialog);

    resendAll(auth);

    const request = req.clone({ withCredentials: true });
    if (request.method === 'POST' && request.url.endsWith('/account/login')) {
        return next(request);
    }
    if (authenticationRequested) {
        return suspendRequest(request, next);
    }
    return next(request).pipe(
        catchError((err) => {
            if (err instanceof HttpErrorResponse && err.status == 401) {
                requestAuthentication(dialog);
                return suspendRequest(request, next);
            }
            return of(err);
        })
    );
};

function suspendRequest(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
    if (req.method !== 'GET') {
        return of({
            type: HttpEventType.User,
            ok: false,
        } as HttpUserEvent<unknown>);
    }
    const handler = new Subject<HttpEvent<unknown>>();
    requestQueue.push({
        next,
        request: req,
        responseHandler$: handler,
    });
    return handler.asObservable();
}

function requestAuthentication(dialog: MatDialog): void {
    if (authenticationRequested) {
        return;
    }
    authenticationRequested = true;
    dialog.open(LoginComponent, {
        disableClose: true,
        minWidth: '400px',
        autoFocus: 'first-tabbable',
        backdropClass: 'solid'
    });
}
