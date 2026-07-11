import { Component } from '@angular/core';
import { ConfirmDialogButton, ConfirmDialogService, MessageService, TitleService } from '@app/common';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { ArtifactDto } from '@app/web-api';
import { ArtifactSelectors } from '@app/artifact/store';
import { artifactsActions } from '@app/artifact/store/artifacts-actions';
import { ArtifactLink } from '@app/artifact';
import { collapseOnLeaveAnimation } from 'angular-animations';
import { LayoutFullComponent } from '@app/layout';
import {
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle
} from '@angular/material/card';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { AsyncPipe, DatePipe } from '@angular/common';

interface ArtifactData {
    artifact: ArtifactDto;
    links: ArtifactLink;
}

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
    animations: [
        collapseOnLeaveAnimation()
    ],
    imports: [
        LayoutFullComponent,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardSubtitle,
        MatCardContent,
        MatCardActions,
        MatIconButton,
        MatTooltip,
        MatIcon,
        MatButton,
        MatMenu,
        MatMenuItem,
        ClipboardModule,
        AsyncPipe,
        DatePipe
    ]
})
export class ListComponent {
    public loading$: Observable<boolean>;
    public artifacts$: Observable<ArtifactData[]>;
    public hasMore$: Observable<boolean>;

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

    public onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if(file) {
            if(file.size > 15728640) {
                this.messageService.showError('Размер файла не должен превышать 15 МиБ');
                return;
            }
            this.store$.dispatch(artifactsActions.uploadFile({ file }));
        }
    }

    public async deleteFile(artifact: ArtifactDto): Promise<void> {
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
        if(result.button === ConfirmDialogButton.Yes) {
            this.store$.dispatch(artifactsActions.deleteFile({ id: artifact.id }));
        }
    }

    public loadMore(): void {
        this.store$.dispatch(artifactsActions.loadList());
    }
}
