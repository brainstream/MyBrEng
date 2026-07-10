import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { tagsActions, TagsSelectors } from '../store';
import { Observable } from 'rxjs';
import { TagDto } from '@app/web-api';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TagEditFormComponent } from '../tag-edit-form';
import { collapseOnLeaveAnimation } from 'angular-animations';
import { TitleService } from '@app/common';
import { LayoutFullComponent } from '@app/layout';
import { TagListItemComponent } from '../tag-list-item';
import { AsyncPipe } from '@angular/common';
import { MatNavList } from '@angular/material/list';
import { MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-tag-list',
    templateUrl: './tag-list.component.html',
    styleUrl: './tag-list.component.scss',
    animations: [
        collapseOnLeaveAnimation()
    ],
    imports: [LayoutFullComponent, TagListItemComponent, AsyncPipe, MatNavList, MatMenu, MatMenuItem, MatIcon]
})
export class TagListComponent {
    loading$: Observable<boolean>;
    tags$: Observable<TagDto[]>;

    constructor(
        store$: Store,
        titleService: TitleService,
        private bottomSheet: MatBottomSheet
    ) {
        titleService.setTitle('Теги');
        store$.dispatch(tagsActions.loadList());
        this.loading$ = store$.select(TagsSelectors.loading);
        this.tags$ = store$.select(TagsSelectors.list);
    }

    showCreateTagForm() {
        this.bottomSheet.open(TagEditFormComponent);
    }
}
