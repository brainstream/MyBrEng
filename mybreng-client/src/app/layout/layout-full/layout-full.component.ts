import { Component, Input } from '@angular/core';
import { ThemeService } from '@app/shared';

@Component({
  selector: 'app-layout-full',
  templateUrl: './layout-full.component.html',
  styleUrls: ['./layout-full.component.scss']
})
export class LayoutFullComponent {
  @Input() loading: boolean | null = null;

  constructor(private readonly theme: ThemeService) {
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
