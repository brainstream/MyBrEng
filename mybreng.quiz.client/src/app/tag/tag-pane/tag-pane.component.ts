import { Component, Input } from "@angular/core";
import { TagDto } from "@app/web-api";
import { TagComponent } from "../tag";


@Component({
    selector: 'app-tag-pane',
    templateUrl: './tag-pane.component.html',
    styleUrls: ['./tag-pane.component.scss'],
    imports: [TagComponent]
})
export class TagPaneComponent {
    @Input() tags: TagDto[];
}
