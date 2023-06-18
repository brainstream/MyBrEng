import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { StudentDetailsComponent } from "./student-details";
import { StudentListComponent } from "./student-list";

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: StudentListComponent
    }, {
        path: ':id',
        component: StudentDetailsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StudentRoutingModule { }
