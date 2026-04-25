import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import {UploadComponent} from "@app/artifact/upload";

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: UploadComponent // TODO: list
    },
    {
        path: 'upload',
        pathMatch: 'full',
        component: UploadComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ArtifactRoutingModule { }
