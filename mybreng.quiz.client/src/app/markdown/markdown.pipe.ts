import { Pipe, PipeTransform } from '@angular/core';
import { MarkdownService } from './markdown.service';

@Pipe({
    name: 'markdown'
})
export class MarkdownPipe implements PipeTransform {
    constructor(private readonly markdown: MarkdownService) {
    }

    transform(value: string): unknown {
        return this.markdown.convertToHtml(value);
    }
}
