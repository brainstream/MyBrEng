import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StudentListComponent } from './student-list';
import { StudentDetailsComponent } from './student-details';
import { StudentRoutingModule } from './student-routing.module';
import { LayoutModule } from '@app/layout';

@NgModule({
  declarations: [
    StudentListComponent,
    StudentDetailsComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    StudentRoutingModule,
    LayoutModule
  ]
})
export class StudentModule { }
