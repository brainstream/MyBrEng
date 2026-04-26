import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArtifactRoutingModule} from "./artifact-routing.module";
import {LayoutModule} from "@app/layout";
import {MatButtonModule} from "@angular/material/button";
import {StoreModule} from "@ngrx/store";
import {ArtifactsEffects, artifactsReducer} from "./store";
import {EffectsModule} from "@ngrx/effects";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {ListComponent} from "@app/artifact/list";
import {MatMenu, MatMenuItem, MatMenuModule} from "@angular/material/menu";

@NgModule({
    declarations: [
        ListComponent
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatMenuModule,
        StoreModule.forFeature('artifacts', artifactsReducer),
        EffectsModule.forFeature([
            ArtifactsEffects
        ]),
        ArtifactRoutingModule,
        LayoutModule,
        MatMenu,
        MatMenuItem
    ]
})
export class ArtifactModule {
}
