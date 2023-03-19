import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { QuizListComponent } from './quiz-list';
import { QuizDetailsComponent } from './quiz-details/';
import { QuizRoutingModule } from './quiz-routing.module';
import { LayoutModule } from '@app/layout';
import { QuizEditFormComponent } from './quiz-edit-form';
import { QuizListItemComponent } from './quiz-list-item';

@NgModule({
  declarations: [
    QuizListComponent,
    QuizDetailsComponent,
    QuizEditFormComponent,
    QuizListItemComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatBottomSheetModule,
    MatFormFieldModule,
    MatListModule,
    MatInputModule,
    QuizRoutingModule,
    LayoutModule
  ]
})
export class QuizModule { }
