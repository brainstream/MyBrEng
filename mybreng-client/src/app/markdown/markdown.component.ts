import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MarkdownService } from './markdown.service';

@Component({
  selector: 'app-markdown',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MarkdownComponent {
  constructor(private readonly markdown: MarkdownService) {
  }

  @Input() set source(text: string) {
    this.html = this.markdown.convertToHtml(text);
  }

  html: string;
}
