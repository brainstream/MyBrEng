import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StudentListComponent } from './student-list';
import { StudentDetailsComponent } from './student-details';
import { StudentRoutingModule } from './student-routing.module';
import { LayoutModule } from '@app/layout';
import { StoreModule } from '@ngrx/store';
import { StudentsEffects, studentsReducer } from './store';
import { EffectsModule } from '@ngrx/effects';
import { MatListModule } from '@angular/material/list';
import { StudentListItemComponent } from './student-list-item';
import { MatCardModule } from '@angular/material/card';
import { StudentQuizRunComponent } from './student-quiz-run';
import { StudentNoteComponent } from './student-note';

@NgModule({
    declarations: [
        StudentListComponent,
        StudentListItemComponent,
        StudentDetailsComponent,
        StudentQuizRunComponent,
        StudentNoteComponent
    ],
    imports: [
        CommonModule,
        StoreModule.forFeature('students', studentsReducer),
        EffectsModule.forFeature([
            StudentsEffects
        ]),
        ClipboardModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatCardModule,
        StudentRoutingModule,
        LayoutModule
    ]
})
export class StudentModule { }
