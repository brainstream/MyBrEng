export class Queue<T> {
    private arr: Array<T> = [];

    public get length(): number {
        return this.arr.length;
    }

    public get empty(): boolean {
        return this.length === 0;
    }

    public push(item: T): void {
        this.arr.unshift(item);
    }

    public pop(): T | undefined {
        return this.arr.pop();
    }

    public head(): T | undefined {
        return this.arr.length ? this.arr[this.arr.length - 1] : undefined;
    }
}
