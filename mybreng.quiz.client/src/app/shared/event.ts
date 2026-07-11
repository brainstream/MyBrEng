import { Subject, Subscription } from 'rxjs';

export interface IPostponedEvent {
    flush(): void;
}

export class Event<T> {
    private readonly subject$ = new Subject<T>();

    public subscribe(next: (value: T) => void): Subscription {
        return this.subject$.subscribe(next);
    }

    public raise(args: T): void {
        this.subject$.next(args);
    }

    public postpone(args: T): IPostponedEvent {
        return {
            flush: (): void => {
                this.raise(args);
            }
        };
    }
}
