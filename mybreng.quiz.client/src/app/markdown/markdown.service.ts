import { Injectable } from '@angular/core';
import { Converter } from 'showdown';

@Injectable({
    providedIn: 'root'
})
export class MarkdownService {
    private readonly converter = new Converter();

    public convertToHtml(text: string): string {
        return this.converter.makeHtml(text);
    }
}
