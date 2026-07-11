import { Injectable } from '@angular/core';
import { TagDto } from '@app/web-api';
import { Event } from '@app/shared';

@Injectable({ providedIn: 'root' })
export class TagsEventsService {
    public readonly tagSaved$ = new Event<TagDto>();
    public readonly tagDeleted$ = new Event<{ id: string }>();
}
