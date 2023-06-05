import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { watchHttpErrors } from '@app/shared';
import { ApiModule, RunDto, RunService } from '@app/web-api';
import { Observable, Subscription, catchError, map, of, switchMap, tap } from 'rxjs';
import { IQuizRepor, mapRunToReport } from '../quiz-report/quiz-report';
import { MessageService } from '@app/common';

@Component({
    selector: 'app-quiz-report-standalone',
    templateUrl: './quiz-report-standalone.component.html',
    styleUrls: ['./quiz-report-standalone.component.scss'],
    providers: [
        ApiModule
    ]
})
export class QuizReportStandaloneComponent implements OnInit, OnDestroy {
    private loadingSubscription: Subscription;
    loading: boolean = false;
    run$: Observable<RunDto | null>;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly runService: RunService,
        private readonly messageService: MessageService
    ) {
    }

    ngOnInit(): void {
        this.run$ = this.activatedRoute.paramMap
            .pipe(
                switchMap(params => {
                    const id = params.get('id');
                    if (id) {
                        return this.load(id);
                    }
                    return of(null);
                }
                ));
        this.loadingSubscription = this.run$.subscribe();
    }

    ngOnDestroy(): void {
        this.loadingSubscription.unsubscribe();
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
