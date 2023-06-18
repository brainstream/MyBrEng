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
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
    selector: 'app-layout-full',
    templateUrl: './layout-full.component.html',
    styleUrls: ['./layout-full.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LayoutFullComponent implements AfterViewInit {
    @ViewChild('loading', { static: true }) loadingTemplate: TemplateRef<any>;
    @ViewChild('navbar', { static: true }) navTemplate: TemplateRef<any>;
    @ViewChild('scrollContainer') scrollContainer: ElementRef<HTMLDivElement>;

    scrollTopButtonVisible: boolean = false;

    constructor(
        private readonly theme: ThemeService,
        private readonly dialog: MatDialog,
        private readonly bottomSheet: MatBottomSheet
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

    showNav() {
        this.bottomSheet.open(this.navTemplate, {
            panelClass: 'layout-full-nav-bottom-panel'
        });
    }

    scrollTop() {
        this.scrollContainer.nativeElement.scrollTo(0, 0);
    }
}
