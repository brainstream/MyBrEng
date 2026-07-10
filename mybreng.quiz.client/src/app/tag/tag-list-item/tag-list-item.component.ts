import { Component, Input } from '@angular/core';
import { TagDto } from '@app/web-api';
import { TagColor } from '../tag-color';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TagEditFormComponent } from '../tag-edit-form';
import { ConfirmDialogButton, ConfirmDialogService } from '@app/common';
import { Store } from '@ngrx/store';
import { tagsActions } from '../store';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-tag-list-item',
    templateUrl: './tag-list-item.component.html',
    styleUrl: './tag-list-item.component.scss',
    imports: [MatCardModule, MatMenuModule, MatIconModule, MatTooltipModule]
})
export class TagListItemComponent {
    private _tag: TagDto;
    color: TagColor;

    constructor(
        private bottomSheet: MatBottomSheet,
        private readonly confirmDialog: ConfirmDialogService,
        private readonly store$: Store
    ) {
    }

    @Input() set tag(value: TagDto) {
        this._tag = value;
        this.color = new TagColor(value.color);
    }

    get tag() {
        return this._tag;
    }

    edit() {
        this.bottomSheet.open(TagEditFormComponent, { data: this._tag });
    }

    async delete() {
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
        if (result.button === ConfirmDialogButton.Yes) {
            this.store$.dispatch(tagsActions.deleteTag({ id: this._tag.id }));
        }
    }
}
