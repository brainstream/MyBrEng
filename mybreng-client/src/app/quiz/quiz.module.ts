import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop'; 
import { QuizListComponent } from './quiz-list';
import { QuizDetailsComponent } from './quiz-details/';
import { QuizRoutingModule } from './quiz-routing.module';
import { LayoutModule } from '@app/layout';
import { QuizEditFormComponent } from './quiz-edit-form';
import { QuizListItemComponent } from './quiz-list-item';
import { QuizQuestionComponent } from './quiz-question';
import { StoreModule } from '@ngrx/store';
import { quizzesReducer } from './store';
import { EffectsModule } from '@ngrx/effects';
import { QuizzesEffects } from './store/quizzes-effects';
import { QuestionTypeNamePipe } from './question-type-name.pipe';
import { QuizQuestionEditFormComponent } from './quiz-question-edit-form';
import { MarkdownModule } from '@app/markdown';
import { CommonModule as AppCommonModule } from '@app/common';
import { QuizQuestionSortComponent } from './quiz-question-sort/quiz-question-sort.component';

@NgModule({
  declarations: [
    QuizListComponent,
    QuizDetailsComponent,
    QuizEditFormComponent,
    QuizListItemComponent,
    QuizQuestionComponent,
    QuestionTypeNamePipe,
    QuizQuestionEditFormComponent,
    QuizQuestionSortComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('quizzes', quizzesReducer),
    EffectsModule.forFeature([
      QuizzesEffects
    ]),
    MatButtonModule,
    MatIconModule,
    MatBottomSheetModule,
    MatFormFieldModule,
    MatListModule,
    MatInputModule,
    MatCardModule,
    MatChipsModule,
    MatMenuModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatDialogModule,
    DragDropModule,
    QuizRoutingModule,
    MarkdownModule,
    LayoutModule,
    AppCommonModule
  ]
})
export class QuizModule { }
