import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RunComponent } from './run';
import { NotFoundComponent } from './not-found';
import { GoRoutingModule } from './go-routing.module';
import { LayoutModule } from '@app/layout';
import { GoEffects, GoEventsService, goReducer } from './store';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
    declarations: [
        RunComponent,
        NotFoundComponent
    ],
    imports: [
        CommonModule,
        StoreModule.forFeature('go', goReducer),
        EffectsModule.forFeature([
            GoEffects
        ]),
        GoRoutingModule,
        LayoutModule
    ],
    providers: [
        GoEventsService
    ]
})
export class GoModule { }
