import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NotFoundComponent } from "./not-found";
import { RunComponent } from "./run";

const routes: Routes = [
    {
        path: ':id',
        component: RunComponent
    }, {
        path: '**',
        component: NotFoundComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GoRoutingModule { }
