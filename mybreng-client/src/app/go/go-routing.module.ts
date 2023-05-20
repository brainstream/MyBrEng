import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RunComponent } from "./run";
import { RunNotFoundComponent } from "./run-not-found";

const routes: Routes = [
    {
        path: ':id',
        component: RunComponent
    }, {
        path: '**',
        component: RunNotFoundComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GoRoutingModule { }
