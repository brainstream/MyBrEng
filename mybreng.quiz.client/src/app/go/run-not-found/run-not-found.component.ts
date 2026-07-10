import { Component } from '@angular/core';
import { LayoutSimpleComponent } from '@app/layout';
import { RunNotFoundMessageComponent } from '../run-not-found-message';

@Component({
    selector: 'app-run-not-found',
    templateUrl: './run-not-found.component.html',
    styleUrls: ['./run-not-found.component.scss'],
    imports: [LayoutSimpleComponent, RunNotFoundMessageComponent]
})
export class RunNotFoundComponent {

}
