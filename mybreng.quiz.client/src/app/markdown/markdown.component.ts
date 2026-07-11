import { Component, Input } from '@angular/core';
import { MarkdownService } from './markdown.service';

@Component({
    selector: 'app-markdown',
    templateUrl: './markdown.component.html',
    styleUrls: ['./markdown.component.scss'],
    imports: []
})
export class MarkdownComponent {
    public html: string;

    constructor(private readonly markdown: MarkdownService) {
    }

    @Input() public set source(text: string) {
        this.html = this.markdown.convertToHtml(text);
    }
}
