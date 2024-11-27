import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    TemplateRef,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { ThemeService } from '@app/common';
import { MatDialog } from '@angular/material/dialog';
import { MatMenu } from '@angular/material/menu';
import { AuthService } from '@app/auth/auth.service';

@Component({
    selector: 'app-layout-full',
    templateUrl: './layout-full.component.html',
    styleUrls: ['./layout-full.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class LayoutFullComponent implements AfterViewInit {
    @Input() menu: MatMenu | null = null;

    @ViewChild('loading', { static: true }) loadingTemplate: TemplateRef<any>;
    @ViewChild('navbar', { static: true }) navTemplate: TemplateRef<any>;
    @ViewChild('scrollContainer') scrollContainer: ElementRef<HTMLDivElement>;

    scrollTopButtonVisible: boolean = false;

    constructor(
        private readonly auth: AuthService,
        private readonly theme: ThemeService,
        private readonly dialog: MatDialog
    ) {
    }

    ngAfterViewInit(): void {
        this.scrollContainer.nativeElement.addEventListener('scroll', () => {
            this.scrollTopButtonVisible = this.scrollContainer.nativeElement.scrollTop > 0;
        })
    }

    @Input() set loading(value: boolean | null) {
        if (value) {
            this.dialog.open(this.loadingTemplate, {
                disableClose: true,
                panelClass: 'layout-full-loading'
            });
        } else {
            this.dialog.closeAll();
        }
    }

    setSystemTheme() {
        this.theme.setSystem();
    }

    setDarkTheme() {
        this.theme.setDark();
    }

    setLightTheme() {
        this.theme.setLight();
    }

    scrollTop() {
        this.scrollContainer.nativeElement.scrollTo(0, 0);
    }
    
    logOut() {
        this.auth.logout().then(() => document.location.reload());
    }
}
