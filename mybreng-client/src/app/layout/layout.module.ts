import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LayoutSimpleComponent } from './layout-simple';
import { LayoutFullComponent } from './layout-full';
import { RouterModule } from '@angular/router';
import { CommonModule as AppCommonModule } from '@app/common';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    LayoutSimpleComponent,
    LayoutFullComponent
  ],
  exports: [
    LayoutFullComponent,
    LayoutSimpleComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    AppCommonModule
  ]
})
export class LayoutModule { }
