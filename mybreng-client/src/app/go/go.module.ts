import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RunComponent } from './run';
import { NotFoundComponent } from './not-found';
import { GoRoutingModule } from './go-routing.module';
import { LayoutModule } from '@app/layout';

@NgModule({
    declarations: [
        RunComponent,
        NotFoundComponent
    ],
    imports: [
        CommonModule,
        GoRoutingModule,
        LayoutModule
    ]
})
export class GoModule { }
