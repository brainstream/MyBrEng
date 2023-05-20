import { RunDto } from "@app/web-api";

export interface IGoState {
    loadingCounter: number,
    run: RunDto[] | null;
}
