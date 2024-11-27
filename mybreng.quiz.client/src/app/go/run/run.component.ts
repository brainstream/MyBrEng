import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { GoSelectors, goActions } from '../store';
import { RunDto } from '@app/web-api';

@Component({
    selector: 'app-run',
    templateUrl: './run.component.html',
    styleUrls: ['./run.component.scss'],
    standalone: false
})
export class RunComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription[] = [];

    run$: Observable<RunDto | null>;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly store$: Store
    ) {
        this.run$ = store$.select(GoSelectors.run);
    }

    ngOnInit(): void {
        this.subscriptions.push(this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.store$.dispatch(goActions.load({ id }))
            }
        }));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.subscriptions.splice(0, this.subscriptions.length);
    }
}
