import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    standalone: false
})
export class SearchComponent {
    @ViewChild('search') private searchElement: ElementRef;
    
    @Input() searchString: string = '';

    @Output() searchStringChange = new EventEmitter<string>();

    @Input() placeholder: string = '';

    setFocus() {
        if(!this.searchString) {
            this.searchElement.nativeElement.focus();
        }
    }

    setSearchString(value: string) {
        if (this.searchString !== value) {
            this.searchString = value;
            this.searchStringChange.emit(value);
        }
    }
}
