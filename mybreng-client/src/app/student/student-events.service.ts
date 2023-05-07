import { Injectable } from "@angular/core";
import { RunSummaryDto, StudentDto } from "@app/web-api";
import { Event } from '@app/shared';

@Injectable({
    providedIn: 'root'
})
export class StudentEventsService {
    readonly studentSaved$ = new Event<StudentDto>();
    readonly studentDeleted$ = new Event<{ id: string }>();
    readonly runCreated$ = new Event<RunSummaryDto>();
}
