import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    StudentRoutingModule,
    LayoutModule
  ]
})
export class StudentModule { }
