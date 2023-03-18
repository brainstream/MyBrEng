import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizListComponent } from './quiz-list';
import { QuizDetailsComponent } from './quiz-details/';
import { QuizRoutingModule } from './quiz-routing.module';
import { LayoutModule } from '@app/layout';

@NgModule({
  declarations: [
    QuizListComponent,
    QuizDetailsComponent
  ],
  imports: [
    CommonModule,
    QuizRoutingModule,
    LayoutModule
  ]
})
export class QuizModule { }
