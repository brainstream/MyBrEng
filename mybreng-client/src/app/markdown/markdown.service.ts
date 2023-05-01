import { Injectable } from '@angular/core';
import { Converter } from 'showdown';

@Injectable({
    providedIn: 'root'
})
export class MarkdownService {
    readonly converter = new Converter();

    convertToHtml(text: string): string {
        return this.converter.makeHtml(text);
    }
}
