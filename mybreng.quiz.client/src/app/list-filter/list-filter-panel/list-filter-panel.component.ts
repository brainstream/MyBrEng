import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TagDto } from '@app/web-api';
import { combineLatest, map, Observable, startWith, Subject, Subscription, tap } from 'rxjs';
import { IListFilter } from '../list-filter';

@Component({
    selector: 'app-list-filter-panel',
    standalone: false,
    templateUrl: './list-filter-panel.component.html',
    styleUrl: './list-filter-panel.component.scss'
})
export class ListFilterPanelComponent implements OnInit, OnDestroy {
    private tags$ = new Subject<TagDto[]>();
    private formChangeSubscription: Subscription;
    form: FormGroup;
    filteredTags$: Observable<TagDto[]>;
    hasFilter: boolean = false;

    @Input() set tags(value: TagDto[]) {
        this.tags$.next(value);
    }

    @Output() filterChanged = new EventEmitter<IListFilter>();

    constructor(
        formBuilder: FormBuilder
    ) {
        this.form = formBuilder.group({
            searchString: '',
            tags: [],
            tagsFilter: ''
        });
        this.filteredTags$ = combineLatest([
                this.tags$,
                this.form.controls['tagsFilter'].valueChanges.pipe(startWith(''))
            ]).pipe(
                map(([tags, filter]) => {
                    const lcFilter = (filter as string ?? '').toLowerCase();
                    return tags.filter(t => t.name.toLowerCase().includes(lcFilter));
                })
            );
    }

    ngOnInit(): void {
        this.formChangeSubscription = this.form.valueChanges
            .pipe(
                tap(() => {
                    const filter = {
                        searchString: this.form.controls['searchString'].value ?? '',
                        tags: this.form.controls['tags'].value ?? []
                    };
                    this.hasFilter = filter.searchString.length || filter.tags.length;
                    this.filterChanged.emit(filter)
                })
            )
            .subscribe();
    }

    ngOnDestroy(): void {
        this.formChangeSubscription?.unsubscribe();
    }

    get isSearchStringEmpty(): boolean {
        return this.form.controls['searchString'].value.length === 0;
    }

    clearSearchString(): void {
        this.form.controls['searchString'].setValue('');
    }

    clearFilter(): void {
        this.form.setValue({
            searchString: '',
            tags: [],
            tagsFilter: ''
        });
    }
}
