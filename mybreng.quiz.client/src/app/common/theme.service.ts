import { Injectable } from '@angular/core';

type Scheme = 'dark' | 'light';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private static readonly lsKey = 'color-theme';
    private static readonly darkScheme: Scheme = 'dark';
    private static readonly lightScheme: Scheme = 'light';

    public restore(): void {
        const scheme = this.getPreferredScheme();
        this.setScheme(scheme);
    }

    public setDark(): void {
        this.setScheme(ThemeService.darkScheme);
        this.setPreferredScheme(ThemeService.darkScheme);
    }

    public setLight(): void {
        this.setScheme(ThemeService.lightScheme);
        this.setPreferredScheme(ThemeService.lightScheme);
    }

    public setSystem(): void {
        this.setScheme(undefined);
        this.setPreferredScheme(undefined);
    }

    public isSystem(): boolean {
        return this.getPreferredScheme() === undefined;
    }

    public isDark(): boolean {
        return this.getPreferredScheme() === ThemeService.darkScheme;
    }

    public isLight(): boolean {
        return this.getPreferredScheme() === ThemeService.lightScheme;
    }

    private getPreferredScheme(): Scheme | undefined {
        return localStorage[ThemeService.lsKey] as Scheme | undefined;
    }

    private setPreferredScheme(scheme?: Scheme): void {
        if(scheme) {
            localStorage[ThemeService.lsKey] = scheme;
        } else {
            localStorage.removeItem(ThemeService.lsKey);
        }
    }

    private setScheme(scheme?: Scheme): void {
        const html = document.getElementsByTagName('html')[0];
        html.classList.remove(ThemeService.darkScheme, ThemeService.lightScheme);
        if(scheme) {
            html.classList.add(scheme);
        }
    }
}
