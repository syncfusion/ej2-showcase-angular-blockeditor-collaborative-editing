import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';

/**
 * Wrapped Syncfusion Button component for Angular
 */
@Component({
  selector: 'app-syncfusion-button',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <button
      ejs-button
      [id]="id"
      [cssClass]="cssClass"
      [title]="title"
      [disabled]="disabled"
      [isPrimary]="isPrimary"
      [iconCss]="iconCss"
      [attr.aria-label]="ariaLabel"
      (click)="onClick($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class SyncfusionButtonComponent {
  @Input() id?: string;
  @Input() cssClass: string = '';
  @Input() title?: string;
  @Input() disabled: boolean = false;
  @Input() isPrimary: boolean = false;
  @Input() iconCss?: string;
  @Input() ariaLabel?: string;

  @Output() clicked = new EventEmitter<Event>();

  onClick(event: Event): void {
    this.clicked.emit(event);
  }
}
