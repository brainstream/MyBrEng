import { Component, Input } from "@angular/core";
import { TagDto } from "@app/web-api";
import { TagColor } from "../tag-color";

@Component({
    selector: 'app-tag',
    templateUrl: './tag.component.html',
    styleUrls: ['./tag.component.scss'],
    standalone: false
})
export class TagComponent {
    color: TagColor;
    name: string;

    @Input() set tag(tag: TagDto) {
        this.color = new TagColor(tag.color);
        this.name = tag.name;
    }
}
