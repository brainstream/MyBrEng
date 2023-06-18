import { HttpErrorResponse, HttpEvent, HttpEventType } from "@angular/common/http";
import { NEVER, Observable, map, of, switchMap, throwError } from "rxjs";

export function watchHttpErrors<T>(call: Observable<HttpEvent<T>>): Observable<T> {
    return call
        .pipe(
            switchMap(response => {
                if (isHttpErrorResponse(response)) {
                    return throwError(() => 'HTTP Error');
                } else if (response.type == HttpEventType.Response) {
                    return of(response.body);
                }
                return NEVER;
            }),
            map(data => data!)
        );
}

function isHttpErrorResponse(event: HttpEvent<any> | HttpErrorResponse): event is HttpErrorResponse {
    return 'name' in event && event['name'] == 'HttpErrorResponse';
}
