import { Component, Input, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ThemeService } from '@app/common';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-layout-full',
  templateUrl: './layout-full.component.html',
  styleUrls: ['./layout-full.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutFullComponent {
  @ViewChild('loading', {static: true}) loadingTemplate: TemplateRef<any>;

  constructor(
    private readonly theme: ThemeService,
    private readonly dialog: MatDialog
  ) {
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
}
