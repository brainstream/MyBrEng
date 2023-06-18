import { Injectable } from "@angular/core";
import { RunSummaryDto, StudentDto, StudentNoteEditDto } from "@app/web-api";
import { Event } from '@app/shared';

@Injectable()
export class StudentsEventsService {
    readonly studentSaved$ = new Event<StudentDto>();
    readonly studentDeleted$ = new Event<{ id: string }>();
    readonly noteSaved$ = new Event<StudentNoteEditDto>();
    readonly runCreated$ = new Event<RunSummaryDto>();
}
