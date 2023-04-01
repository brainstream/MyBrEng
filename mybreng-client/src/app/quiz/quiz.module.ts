import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
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

@NgModule({
  declarations: [
    QuizListComponent,
    QuizDetailsComponent,
    QuizEditFormComponent,
    QuizListItemComponent,
    QuizQuestionComponent,
    QuestionTypeNamePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
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
    QuizRoutingModule,
    LayoutModule
  ]
})
export class QuizModule { }
