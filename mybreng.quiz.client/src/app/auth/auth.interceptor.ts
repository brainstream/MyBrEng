import {
    HttpErrorResponse,
    HttpEvent,
    HttpEventType,
    HttpHandlerFn,
    HttpInterceptorFn,
    HttpRequest,
    HttpUserEvent
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, first, Observable, of, skip, Subject, Subscription } from 'rxjs';
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
let resendSubscription: Subscription | null = null;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(AuthService);
    const dialog = inject(MatDialog);

    const request = req.clone({ withCredentials: true });
    if(request.method === 'POST' && request.url.endsWith('/account/login')) {
        return next(request);
    }
    if(authenticationRequested) {
        return suspendRequest(request, next);
    }
    return next(request).pipe(
        catchError(err => {
            if(err instanceof HttpErrorResponse && err.status === 401) {
                requestAuthentication(dialog, auth);
                return suspendRequest(request, next);
            }
            return of(err as HttpEvent<unknown>);
        })
    );
};

function suspendRequest(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
    if(req.method !== 'GET') {
        return of({
            type: HttpEventType.User,
            ok: false
        } as HttpUserEvent<unknown>);
    }
    const handler = new Subject<HttpEvent<unknown>>();
    requestQueue.push({
        next,
        request: req,
        responseHandler$: handler
    });
    return handler.asObservable();
}

function requestAuthentication(dialog: MatDialog, auth: AuthService): void {
    if(authenticationRequested) {
        return;
    }
    authenticationRequested = true;
    ensureResendSubscription(auth);
    dialog.open(LoginComponent, {
        disableClose: true,
        minWidth: '400px',
        autoFocus: 'first-tabbable',
        backdropClass: 'solid'
    });
}

function ensureResendSubscription(auth: AuthService): void {
    if(resendSubscription) {
        return;
    }
    resendSubscription = auth.authenticated
        .pipe(
            skip(1),
            first(ok => !!ok)
        )
        .subscribe(() => {
            authenticationRequested = false;
            resendSubscription = null;
            while(!requestQueue.empty) {
                const req = requestQueue.pop();
                if(req) {
                    req.next(req.request).subscribe(response => {
                        req.responseHandler$.next(response);
                    });
                }
            }
        });
}
