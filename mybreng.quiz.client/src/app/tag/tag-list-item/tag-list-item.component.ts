import { Component, Input } from '@angular/core';
import { TagDto } from '@app/web-api';
import { TagColor } from '../tag-color';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TagEditFormComponent } from '../tag-edit-form';
import { ConfirmDialogButton, ConfirmDialogService } from '@app/common';
import { Store } from '@ngrx/store';
import { tagsActions } from '../store';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

@Component({
    selector: 'app-tag-list-item',
    templateUrl: './tag-list-item.component.html',
    styleUrl: './tag-list-item.component.scss',
    imports: [MatCard, MatIcon, MatTooltip, MatIconButton, MatMenuTrigger, MatMenu, MatMenuItem]
})
export class TagListItemComponent {
    public color: TagColor;

    constructor(
        private readonly bottomSheet: MatBottomSheet,
        private readonly confirmDialog: ConfirmDialogService,
        private readonly store$: Store
    ) {
    }

    private _tag: TagDto;

    public get tag(): TagDto {
        return this._tag;
    }

    @Input() public set tag(value: TagDto) {
        this._tag = value;
        this.color = new TagColor(value.color);
    }

    public edit(): void {
        this.bottomSheet.open(TagEditFormComponent, { data: this._tag });
    }

    public async delete(): Promise<void> {
        const result = await this.confirmDialog.show({
            text: `Вы действительно хотите удалить тег "${this._tag.name}"?`,
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
            this.store$.dispatch(tagsActions.deleteTag({ id: this._tag.id }));
        }
    }
}
