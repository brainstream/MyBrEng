import {Component} from '@angular/core';
import {Store} from "@ngrx/store";
import {artifactsActions} from "@app/artifact/store/artifacts-actions";
import {Observable, map, BehaviorSubject} from "rxjs";
import {ArtifactSelectors} from "@app/artifact/store";
import {concatLatestFrom} from "@ngrx/operators";
import {environment} from "@app/environment";

type FileData = {
    mime: string,
    name: string
};

class MarkdownData {
    image: string;
    audio: string;

    constructor(fileId: string, fileData: FileData) {
        const url = environment.artifactBaseUrl + "/api/artifact/" + fileId;
        this.audio = `<audio controls><source src="${url}" type="${fileData.mime}"></audio>`
        this.image = `![${fileData.name}](${url})`;
    }
}

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrl: './upload.component.scss',
    standalone: false
})
export class UploadComponent {
    private lastUploadedFile$: BehaviorSubject<FileData>;

    markdown$: Observable<MarkdownData | null>;
    loading$: Observable<boolean>;

    constructor(private readonly store$: Store) {
        this.loading$ = store$.select(ArtifactSelectors.loading);
        this.lastUploadedFile$ = new BehaviorSubject<FileData>({ mime: '', name: '' });
        this.markdown$ = store$.select(ArtifactSelectors.lastUploadedFileId).pipe(
            concatLatestFrom(() => this.lastUploadedFile$),
            map(([id, fileData]) => {
                if (id === null) {
                    return null;
                }
                return new MarkdownData(id, fileData);
            })
        );
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (file) {
            this.lastUploadedFile$.next({ mime: file.type, name: file.name });
            this.store$.dispatch(artifactsActions.uploadFile({file}))
        }
    }
}
