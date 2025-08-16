import { TagDto } from "@app/web-api";

export interface ITagsState {
    readonly list: TagDto[] | null;
    readonly loadingCounter: number;
}
