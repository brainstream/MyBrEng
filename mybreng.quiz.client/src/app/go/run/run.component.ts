import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription, tap } from 'rxjs';
import { goActions, GoSelectors } from '../store';
import { RunDto } from '@app/web-api';
import { TitleService } from '@app/common';
import { LayoutSimpleComponent } from '@app/layout';
import { RunGoComponent } from '../run-go';
import { RunNotFoundMessageComponent } from '../run-not-found-message';
import { QuizReportComponent } from '@app/quiz-report';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
    selector: 'app-run',
    templateUrl: './run.component.html',
    styleUrls: ['./run.component.scss'],
    imports: [LayoutSimpleComponent, RunGoComponent, RunNotFoundMessageComponent, QuizReportComponent, AsyncPipe, NgIf]
})
export class RunComponent implements OnInit, OnDestroy {
    public run$: Observable<RunDto | null>;
    private readonly subscriptions: Subscription[] = [];

    constructor(
        private readonly route: ActivatedRoute,
        private readonly store$: Store,
        titleService: TitleService
    ) {
        this.run$ = store$
            .select(GoSelectors.run)
            .pipe(tap(run => titleService.setTitle(run?.title)));
    }

    public ngOnInit(): void {
        this.subscriptions.push(this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if(id) {
                this.store$.dispatch(goActions.load({ id }));
            }
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.subscriptions.splice(0, this.subscriptions.length);
    }
}
