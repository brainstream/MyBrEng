import {Injectable} from "@angular/core";
import {Event} from "@app/shared";

@Injectable({ providedIn: 'root' })
export class ArtifactEventsService {
    readonly artifactSaved$ = new Event<{id: string}>();
}
