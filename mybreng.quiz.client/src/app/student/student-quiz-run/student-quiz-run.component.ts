import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RunSummaryDto } from '@app/web-api';
import {
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardFooter,
    MatCardHeader,
    MatCardTitle
} from '@angular/material/card';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DatePipe, NgIf } from '@angular/common';

@Component({
    selector: 'app-student-quiz-run',
    templateUrl: './student-quiz-run.component.html',
    styleUrls: ['./student-quiz-run.component.scss'],
    imports: [
        RouterLink,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        MatCardFooter,
        MatCardActions,
        MatIconButton,
        MatMenuTrigger,
        MatIcon,
        MatButton,
        MatDivider,
        MatMenu,
        MatMenuItem,
        ClipboardModule,
        DatePipe,
        NgIf
    ]
})
export class StudentQuizRunComponent {
    public url = '';
    @Output() public deleteRequested = new EventEmitter<RunSummaryDto>();

    constructor(private readonly router: Router) {
    }

    private _run: RunSummaryDto | null = null;

    public get run(): RunSummaryDto | null {
        return this._run;
    }

    @Input() public set run(r: RunSummaryDto | null) {
        this._run = r;
        this.url = r ? this.makeAbsoluteRunPath(r.id) : '';
    }

    public delete(): void {
        if(this._run) {
            this.deleteRequested.emit(this._run);
        }
    }

    private makeAbsoluteRunPath(id: string): string {
        const relativeUrl = this.router.createUrlTree(['/go', id]).toString();
        const link = document.createElement('a');
        link.href = relativeUrl;
        const url = link.href;
        link.remove();
        return url;
    }
}
