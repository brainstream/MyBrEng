import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RunSummaryDto } from '@app/web-api';

@Component({
    selector: 'app-student-quiz-run',
    templateUrl: './student-quiz-run.component.html',
    styleUrls: ['./student-quiz-run.component.scss']
})
export class StudentQuizRunComponent {
    private _run: RunSummaryDto | null = null;
    url: string = '';

    constructor(private readonly router: Router) {
    }

    @Input() set run(r: RunSummaryDto | null) {
        this._run = r;
        this.url = r ? this.makeAbsoluteRunPath(r.id) : '';
    }

    private makeAbsoluteRunPath(id: string) {
        const relativeUrl = this.router.createUrlTree(['/run', id]).toString();
        const link = document.createElement("a");
        link.href = relativeUrl;
        const url = link.href;
        link.remove();
        return url;
    }

    get run(): RunSummaryDto | null {
        return this._run;
    }
}
