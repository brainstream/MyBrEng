import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { watchHttpErrors } from '@app/shared';
import { ApiModule, RunDto, RunService } from '@app/web-api';
import { Observable, catchError, of, switchMap, tap } from 'rxjs';
import { MessageService } from '@app/common';

@Component({
    selector: 'app-quiz-report-standalone',
    templateUrl: './quiz-report-standalone.component.html',
    styleUrls: ['./quiz-report-standalone.component.scss'],
    providers: [
        ApiModule
    ],
    standalone: false
})
export class QuizReportStandaloneComponent {
    readonly run$: Observable<RunDto | null>;

    loading: boolean = false;

    constructor(
        activatedRoute: ActivatedRoute,
        private readonly runService: RunService,
        private readonly messageService: MessageService
    ) {
        this.run$ = activatedRoute.paramMap
            .pipe(
                switchMap(params => {
                    const id = params.get('id');
                    if (id) {
                        return this.load(id);
                    }
                    return of(null);
                })
            );
    }

    private load(id: string): Observable<RunDto | null> {
        this.loading = true;
        return watchHttpErrors(this.runService.runGet(id, 'events'))
            .pipe(
                tap(() => {
                    this.loading = false;
                }),
                catchError(() => {
                    this.loading = false;
                    this.messageService.showError('Во время загрузки данных произошла ошибка');
                    return of(null);
                })
            );
    }
}
