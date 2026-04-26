import {Component} from '@angular/core';
import {TitleService} from "@app/common";
import {Store} from "@ngrx/store";
import {map, Observable} from "rxjs";
import {ArtifactDto} from "@app/web-api";
import {ArtifactSelectors} from "@app/artifact/store";
import {artifactsActions} from "@app/artifact/store/artifacts-actions";
import {ArtifactLink} from "@app/artifact";

interface ArtifactData {
    artifact: ArtifactDto;
    links: ArtifactLink;
}

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
    standalone: false
})
export class ListComponent {
    loading$: Observable<boolean>;
    artifacts$: Observable<ArtifactData[]>;

    constructor(titleService: TitleService, private readonly store$: Store) {
        titleService.setTitle('Файлы');
        store$.dispatch(artifactsActions.loadList());
        this.loading$ = store$.select(ArtifactSelectors.loading);
        this.artifacts$ = store$
            .select(ArtifactSelectors.list)
            .pipe(
                map(artifacts => artifacts.map(a => ({
                    artifact: a,
                    links: new ArtifactLink(a.id, a.filename)
                })))
            );
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (file) {
            // this.lastUploadedFile$.next({ mime: file.type, name: file.name });
            this.store$.dispatch(artifactsActions.uploadFile({file}))
        }
    }
}
