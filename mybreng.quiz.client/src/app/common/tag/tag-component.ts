import { Component, Input } from "@angular/core";
import { TagDto } from "@app/web-api";

@Component({
    selector: 'app-tag',
    templateUrl: './tag.component.html',
    styleUrls: ['./tag.component.scss'],
    standalone: false
})
export class TagComponent {
    bgColor: string;
    fgColor: string;
    name: string;

    @Input() set tag(tag: TagDto) {
        this.name = tag.name;
        let color = tag.color ?? 0;
        color >>>= 0;
        const b = color & 0xFF;
        const g = (color >> 8) & 0xFF;
        const r = (color >> 16) & 0xFF;
        this.bgColor = `rgb(${r},${g},${b})`;
        if (0.299 * r + 0.587 * g + 0.114 * b <= 128) {
            this.fgColor = 'white';
        } else {
            this.fgColor = 'black';
        }
    }
}
