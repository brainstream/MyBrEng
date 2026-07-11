import { Injectable } from '@angular/core';
import { Event } from '@app/shared';

@Injectable({ providedIn: 'root' })
export class ArtifactEventsService {
    public readonly artifactSaved$ = new Event<{ id: string }>();
    public readonly artifactDeleted$ = new Event<{ id: string }>();
}
