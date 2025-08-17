import { Injectable } from "@angular/core";
import { TagDto } from "@app/web-api";
import { Event } from '@app/shared';

@Injectable()
export class TagsEventsService {
    readonly tagSaved$ = new Event<TagDto>();
    readonly tagDeleted$ = new Event<{ id: string }>();
}
