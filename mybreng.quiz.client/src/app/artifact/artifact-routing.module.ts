import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import {ListComponent} from "@app/artifact/list";

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: ListComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ArtifactRoutingModule { }
