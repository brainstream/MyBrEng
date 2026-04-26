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
import {MatTooltipModule} from "@angular/material/tooltip";
import {ClipboardModule} from "@angular/cdk/clipboard";

@NgModule({
    declarations: [
        ListComponent
    ],
    imports: [
        CommonModule,
        ClipboardModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatMenuModule,
        MatTooltipModule,
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
