import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { QuizDetailsComponent } from "./quiz-details";
import { QuizListComponent } from "./quiz-list";

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: QuizListComponent
    }, {
        path: ':id',
        component: QuizDetailsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class QuizRoutingModule { }
