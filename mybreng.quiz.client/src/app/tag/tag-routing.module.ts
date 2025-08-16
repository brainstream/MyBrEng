import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TagListComponent } from "./tag-list";

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: TagListComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TagRoutingModule { }
