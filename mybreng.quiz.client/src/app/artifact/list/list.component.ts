import {Component} from '@angular/core';
import {ConfirmDialogButton, ConfirmDialogService, MessageService, TitleService} from "@app/common";
import {Store} from "@ngrx/store";
import {map, Observable} from "rxjs";
import {ArtifactDto} from "@app/web-api";
import {ArtifactSelectors} from "@app/artifact/store";
import {artifactsActions} from "@app/artifact/store/artifacts-actions";
import {ArtifactLink} from "@app/artifact";
import {collapseOnLeaveAnimation} from "angular-animations";

interface ArtifactData {
    artifact: ArtifactDto;
    links: ArtifactLink;
}

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
    standalone: false,
    animations: [
        collapseOnLeaveAnimation()
    ],
})
export class ListComponent {
    loading$: Observable<boolean>;
    artifacts$: Observable<ArtifactData[]>;
    hasMore$: Observable<boolean>;

    constructor(
        titleService: TitleService,
        private readonly store$: Store,
        private readonly confirmDialog: ConfirmDialogService,
        private readonly messageService: MessageService
    ) {
        titleService.setTitle('Файлы');
        store$.dispatch(artifactsActions.loadList());
        this.loading$ = store$.select(ArtifactSelectors.loading);
        this.artifacts$ = store$
            .select(ArtifactSelectors.list)
            .pipe(
                map(artifacts => artifacts.map(a => ({
                    artifact: a,
                    links: new ArtifactLink(a)
                })))
            );
        this.hasMore$ = store$.select(ArtifactSelectors.hasMore);
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (file) {
            if (file.size > 15728640) {
                this.messageService.showError('Размер файла не должен превышать 15 МиБ');
                return;
            }
            this.store$.dispatch(artifactsActions.uploadFile({file}))
        }
    }

    async deleteFile(artifact: ArtifactDto) {
        const result = await this.confirmDialog.show({
            text: `Вы действительно хотите удалить "${artifact.filename}"?`,
            buttons: {
                yes: {
                    text: 'Удалить',
                    icon: 'delete',
                    color: 'warn'
                },
                no: {
                    text: 'Отменить',
                    color: 'default'
                }
            }
        });
        if (result.button === ConfirmDialogButton.Yes) {
            this.store$.dispatch(artifactsActions.deleteFile({ id: artifact.id }));
        }
    }

    loadMore(): void {
        this.store$.dispatch(artifactsActions.loadList());
    }
}
