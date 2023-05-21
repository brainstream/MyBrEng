import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RunComponent } from './run';
import { GoRoutingModule } from './go-routing.module';
import { LayoutModule } from '@app/layout';
import { GoEffects, GoEventsService, goReducer } from './store';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RunQuestionComponent } from './run-question';
import { RunNotFoundComponent } from './run-not-found';
import { RunNotFoundMessageComponent } from './run-not-found-message';
import { RunGoComponent } from './run-go';
import { RunResultsComponent } from './run-results';
import { MarkdownModule } from '@app/markdown';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RunSingleChoiceAnswersComponent } from './run-single-choice-answers';
import { RunMultipleChoicesAnswersComponent } from './run-multiple-choices-answers';
import { RunFreeTextAnswerComponent } from './run-free-text-answer';

@NgModule({
    declarations: [
        RunComponent,
        RunQuestionComponent,
        RunNotFoundComponent,
        RunNotFoundMessageComponent,
        RunGoComponent,
        RunResultsComponent,
        RunSingleChoiceAnswersComponent,
        RunMultipleChoicesAnswersComponent,
        RunFreeTextAnswerComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forFeature('go', goReducer),
        EffectsModule.forFeature([
            GoEffects
        ]),
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatCheckboxModule,
        MatRadioModule,
        MatFormFieldModule,
        MatInputModule,
        GoRoutingModule,
        LayoutModule,
        MarkdownModule
    ],
    providers: [
        GoEventsService
    ]
})
export class GoModule { }
