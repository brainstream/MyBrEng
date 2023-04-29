import { Subject, Subscription } from "rxjs";

export interface IPostponedEvent {
    flush(): void;
}

export class Event<T> {
    private subject$ = new Subject<T>();

    subscribe(onext: (value: T) => void): Subscription {
        return this.subject$.subscribe(onext);
    }

    raise(args: T): void {
        this.subject$.next(args);
    }

    postpone(args: T): IPostponedEvent {
        const event = this;
        return {
            flush() {
                event.raise(args);
            },
        };
    }
}
