import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagDto } from '@app/web-api';
import { combineLatest, map, Observable, startWith, Subject, Subscription, tap } from 'rxjs';
import { IListFilter } from '../list-filter';
import { AsyncPipe } from '@angular/common';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatTooltip } from '@angular/material/tooltip';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@Component({
    selector: 'app-list-filter-panel',
    templateUrl: './list-filter-panel.component.html',
    styleUrl: './list-filter-panel.component.scss',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        AsyncPipe,
        MatFormField,
        MatLabel,
        MatSelect,
        MatOption,
        MatInput,
        MatSuffix,
        MatIconButton,
        MatIcon,
        MatTooltip,
        NgxMatSelectSearchModule
    ]
})
export class ListFilterPanelComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    public filteredTags$: Observable<TagDto[]>;
    public hasFilter = false;
    @Output() public filterChanged = new EventEmitter<IListFilter>();
    private readonly tags$ = new Subject<TagDto[]>();
    private formChangeSubscription: Subscription;

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
                const lcFilter = (filter as string).toLowerCase();
                return tags.filter(t => t.name.toLowerCase().includes(lcFilter));
            })
        );
    }

    @Input() public set tags(value: TagDto[]) {
        this.tags$.next(value);
    }

    public get isSearchStringEmpty(): boolean {
        return (this.form.controls['searchString'].value as string).length === 0;
    }

    public ngOnInit(): void {
        this.formChangeSubscription = this.form.valueChanges
            .pipe(
                tap(() => {
                    const filter: IListFilter = {
                        searchString: (this.form.controls['searchString'].value as string),
                        tags: (this.form.controls['tags'].value as string[])
                    };
                    this.hasFilter = filter.searchString.length > 0 || filter.tags.length > 0;
                    this.filterChanged.emit(filter);
                })
            )
            .subscribe();
    }

    public ngOnDestroy(): void {
        this.formChangeSubscription.unsubscribe();
    }

    public clearSearchString(): void {
        this.form.controls['searchString'].setValue('');
    }

    public clearFilter(): void {
        this.form.setValue({
            searchString: '',
            tags: [],
            tagsFilter: ''
        });
    }
}
