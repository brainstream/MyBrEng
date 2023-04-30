import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StudentListComponent } from './student-list';
import { StudentDetailsComponent } from './student-details';
import { StudentRoutingModule } from './student-routing.module';
import { LayoutModule } from '@app/layout';
import { StoreModule } from '@ngrx/store';
import { StudentsEffects, studentsReducer } from './store';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [
    StudentListComponent,
    StudentDetailsComponent
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature('students', studentsReducer),
    EffectsModule.forFeature([
      StudentsEffects
    ]),
    MatButtonModule,
    MatIconModule,
    StudentRoutingModule,
    LayoutModule
  ]
})
export class StudentModule { }
