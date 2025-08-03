import { Component, Input } from "@angular/core";
import { TagDto } from "@app/web-api";

@Component({
    selector: 'app-tag-pane',
    templateUrl: './tag-pane.component.html',
    styleUrls: ['./tag-pane.component.scss'],
    standalone: false
})
export class TagPaneComponent {
    @Input() tags: TagDto[];
}
