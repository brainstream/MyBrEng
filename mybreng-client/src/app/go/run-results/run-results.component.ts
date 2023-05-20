import { Component, Input } from '@angular/core';
import { RunDto } from '@app/web-api';

@Component({
  selector: 'app-run-results',
  templateUrl: './run-results.component.html',
  styleUrls: ['./run-results.component.scss']
})
export class RunResultsComponent {
    @Input() run: RunDto;
}
