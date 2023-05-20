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

@NgModule({
    declarations: [
        RunComponent,
        RunQuestionComponent,
        RunNotFoundComponent,
        RunNotFoundMessageComponent,
        RunGoComponent,
        RunResultsComponent
    ],
    imports: [
        CommonModule,
        StoreModule.forFeature('go', goReducer),
        EffectsModule.forFeature([
            GoEffects
        ]),
        GoRoutingModule,
        LayoutModule,
        MarkdownModule
    ],
    providers: [
        GoEventsService
    ]
})
export class GoModule { }
