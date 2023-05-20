import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { goActions } from '../store';

@Component({
    selector: 'app-run',
    templateUrl: './run.component.html',
    styleUrls: ['./run.component.scss']
})
export class RunComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription[] = [];

    constructor(
        private readonly route: ActivatedRoute,
        private readonly store$: Store
    ) {
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
