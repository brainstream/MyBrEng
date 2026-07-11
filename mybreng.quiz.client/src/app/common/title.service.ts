import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class TitleService {
    constructor(private readonly title: Title) {
    }

    public setTitle(title?: string): void {
        const siteName = 'QuizTime';
        this.title.setTitle(title ? `${title} | ${siteName}` : siteName);
    }
}
