import { Injectable } from '@angular/core';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

/**
 * Service for converting HTML to Markdown
 * Uses Turndown library with GitHub Flavored Markdown support
 */
@Injectable({
  providedIn: 'root'
})
export class TurndownServiceWrapper {
  private turndownService: TurndownService;

  constructor() {
    this.turndownService = new TurndownService({
      codeBlockStyle: 'fenced',
      emDelimiter: '_',
      bulletListMarker: '-',
      headingStyle: 'atx'
    });

    // Add GitHub Flavored Markdown support
    this.turndownService.use(gfm);
  }

  /**
   * Convert HTML string to Markdown
   */
  turndown(html: string): string {
    return this.turndownService.turndown(html);
  }
}
