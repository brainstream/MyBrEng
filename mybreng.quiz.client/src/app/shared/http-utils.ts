import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { map, NEVER, Observable, of, switchMap, throwError } from 'rxjs';

export function watchHttpErrors<T>(call: Observable<HttpEvent<T>>): Observable<T> {
    return call
        .pipe(
            switchMap(response => {
                if(isHttpErrorResponse(response)) {
                    return throwError(() => 'HTTP Error');
                } else if(response.type === HttpEventType.Response) {
                    return of(response.body);
                }
                return NEVER;
            }),
            map(data => data!)
        );
}

function isHttpErrorResponse(event: HttpEvent<unknown> | HttpErrorResponse): event is HttpErrorResponse {
    return event instanceof HttpErrorResponse;
}
