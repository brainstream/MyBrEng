import {ArtifactDto} from "@app/web-api";

export interface IArtifactsState {
    readonly loadingCounter: number;
    readonly list: ArtifactDto[] | null;
    readonly totalCount: number;
}
