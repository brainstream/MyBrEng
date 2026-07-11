import { AfterViewInit, Component, ElementRef, Input, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ThemeService } from '@app/common';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@app/auth/auth.service';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-layout-full',
    templateUrl: './layout-full.component.html',
    styleUrls: ['./layout-full.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [
        NgIf,
        NgTemplateOutlet,
        RouterLink,
        RouterLinkActive,
        MatToolbar,
        MatIcon,
        MatIconButton,
        MatButton,
        MatMenuTrigger,
        MatMenu,
        MatMenuItem,
        MatDrawerContainer,
        MatDrawer,
        MatProgressSpinner
    ]
})
export class LayoutFullComponent implements AfterViewInit {
    @Input() public menu: MatMenu | null = null;
    @Input() public secondaryToolbar: TemplateRef<unknown>;
    @ViewChild('loading', { static: true }) public loadingTemplate: TemplateRef<unknown>;
    @ViewChild('navbar', { static: true }) public navTemplate: TemplateRef<unknown>;
    @ViewChild('scrollContainer') public scrollContainer: ElementRef<HTMLDivElement>;
    public scrollTopButtonVisible = false;

    constructor(
        private readonly auth: AuthService,
        private readonly theme: ThemeService,
        private readonly dialog: MatDialog
    ) {
    }

    @Input() public set loading(value: boolean | null) {
        if(value) {
            this.dialog.open(this.loadingTemplate, {
                disableClose: true,
                panelClass: 'layout-full-loading'
            });
        } else {
            this.dialog.closeAll();
        }
    }

    public ngAfterViewInit(): void {
        this.scrollContainer.nativeElement.addEventListener('scroll', () => {
            this.scrollTopButtonVisible = this.scrollContainer.nativeElement.scrollTop > 0;
        });
    }

    public setSystemTheme(): void {
        this.theme.setSystem();
    }

    public setDarkTheme(): void {
        this.theme.setDark();
    }

    public setLightTheme(): void {
        this.theme.setLight();
    }

    public scrollTop(): void {
        this.scrollContainer.nativeElement.scrollTo(0, 0);
    }

    public logOut(): void {
        this.auth.logout().then(() => document.location.reload());
    }
}
