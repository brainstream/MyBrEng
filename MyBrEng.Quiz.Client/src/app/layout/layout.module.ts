import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { LayoutSimpleComponent } from './layout-simple';
import { LayoutFullComponent } from './layout-full';
import { RouterModule } from '@angular/router';

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
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ]
})
export class LayoutModule { }
