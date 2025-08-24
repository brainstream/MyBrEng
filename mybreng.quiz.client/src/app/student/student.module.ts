import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StudentListComponent } from './student-list';
import { StudentDetailsComponent } from './student-details';
import { StudentRoutingModule } from './student-routing.module';
import { LayoutModule } from '@app/layout';
import { CommonModule as AppCommonModule } from '@app/common';
import { StoreModule } from '@ngrx/store';
import { StudentsEffects, studentsReducer } from './store';
import { EffectsModule } from '@ngrx/effects';
import { MatListModule } from '@angular/material/list';
import { StudentListItemComponent } from './student-list-item';
import { MatCardModule } from '@angular/material/card';
import { StudentQuizRunComponent } from './student-quiz-run';
import { StudentNoteComponent } from './student-note';
import { StudentEditFormComponent } from './student-edit-form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { StudentAddRunFormComponent } from './student-add-run-form';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MarkdownModule } from '@app/markdown';
import { TagModule } from '@app/tag';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ListFilterModule } from '@app/list-filter';

@NgModule({
    declarations: [
        StudentListComponent,
        StudentListItemComponent,
        StudentDetailsComponent,
        StudentQuizRunComponent,
        StudentNoteComponent,
        StudentEditFormComponent,
        StudentAddRunFormComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forFeature('students', studentsReducer),
        EffectsModule.forFeature([
            StudentsEffects
        ]),
        ClipboardModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        MatMenuModule,
        MatBottomSheetModule,
        MatAutocompleteModule,
        MatSelectModule,
        NgxMatSelectSearchModule,
        StudentRoutingModule,
        LayoutModule,
        AppCommonModule,
        MarkdownModule,
        TagModule,
        ListFilterModule
    ]
})
export class StudentModule { }
