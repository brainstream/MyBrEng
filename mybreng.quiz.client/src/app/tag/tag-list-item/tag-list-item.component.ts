import { Component, Input } from '@angular/core';
import { TagDto } from '@app/web-api';
import { TagColor } from '../tag-color';

@Component({
    selector: 'app-tag-list-item',
    standalone: false,
    templateUrl: './tag-list-item.component.html',
    styleUrl: './tag-list-item.component.scss'
})
export class TagListItemComponent {
    private _tag: TagDto;
    color: TagColor;

    @Input() set tag(value: TagDto) {
        this._tag = value;
        this.color = new TagColor(value.color);
    }

    get tag() {
        return this._tag;
    }
}
