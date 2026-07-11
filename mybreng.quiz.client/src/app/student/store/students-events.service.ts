import { Injectable } from '@angular/core';
import { RunSummaryDto, StudentDto, StudentNoteEditDto } from '@app/web-api';
import { Event } from '@app/shared';

@Injectable({ providedIn: 'root' })
export class StudentsEventsService {
    public readonly studentSaved$ = new Event<StudentDto>();
    public readonly studentDeleted$ = new Event<{ id: string }>();
    public readonly noteSaved$ = new Event<StudentNoteEditDto>();
    public readonly runCreated$ = new Event<RunSummaryDto>();
}
