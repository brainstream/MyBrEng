import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArtifactRoutingModule} from "./artifact-routing.module";
import {UploadComponent} from "@app/artifact/upload";
import {LayoutModule} from "@app/layout";
import {MatButtonModule} from "@angular/material/button";
import {StoreModule} from "@ngrx/store";
import {ArtifactsEffects, artifactsReducer} from "./store";
import {EffectsModule} from "@ngrx/effects";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
    declarations: [
        UploadComponent
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        StoreModule.forFeature('artifacts', artifactsReducer),
        EffectsModule.forFeature([
            ArtifactsEffects
        ]),
        ArtifactRoutingModule,
        LayoutModule
    ]
})
export class ArtifactModule {
}
