import { Injectable } from '@angular/core';

type Scheme = 'dark' | 'light';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private static readonly lsKey = 'color-theme';
    private static readonly darkScheme: Scheme = 'dark';
    private static readonly lightScheme: Scheme = 'light';

    private getPreferredScheme(): Scheme | undefined {
        return localStorage[ThemeService.lsKey];
    };

    private setPreferredScheme(scheme?: Scheme): void {
        if (scheme) {
            localStorage[ThemeService.lsKey] = scheme;
        } else {
            localStorage.removeItem(ThemeService.lsKey);
        }
    };

    private setScheme(scheme?: Scheme) {
        const html = document.getElementsByTagName('html')[0];
        html.classList.remove(ThemeService.darkScheme, ThemeService.lightScheme);
        if (scheme) {
            html.classList.add(scheme);
        }
    };

    restore(): void {
        const scheme = this.getPreferredScheme();
        this.setScheme(scheme);
    }

    setDark(): void {
        this.setScheme(ThemeService.darkScheme);
        this.setPreferredScheme(ThemeService.darkScheme);
    }

    setLight(): void {
        this.setScheme(ThemeService.lightScheme);
        this.setPreferredScheme(ThemeService.lightScheme)
    }

    setSystem(): void {
        this.setScheme(undefined);
        this.setPreferredScheme(undefined);
    }

    isSystem(): boolean {
        return this.getPreferredScheme() === undefined;
    }

    isDark(): boolean {
        return this.getPreferredScheme() === ThemeService.darkScheme;
    }

    isLight(): boolean {
        return this.getPreferredScheme() === ThemeService.lightScheme;
    }
}
