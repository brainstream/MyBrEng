import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { QuizReportStandaloneComponent } from "./quiz-report-standalone";

const routes: Routes = [{
        path: ':id',
        component: QuizReportStandaloneComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class QuizReportRoutingModule { }
