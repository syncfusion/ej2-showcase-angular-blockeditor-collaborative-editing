import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropDownButtonModule, MenuEventArgs } from '@syncfusion/ej2-angular-splitbuttons';

/**
 * Panel toggle dropdown component
 * Matches React's ToggleOption component using Syncfusion DropDownButton
 */
@Component({
  selector: 'app-toggle-option',
  standalone: true,
  imports: [CommonModule, DropDownButtonModule],
  template: `
    <button ejs-dropdownbutton
      [items]="panelMenuItems"
      (select)="onToggle($event)"
      cssClass="panel-toggle-dropdown e-caret-hide e-small"
      iconCss="e-icons e-more-vertical-2"
      title="Toggle panels"
      aria-label="Toggle panels">
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class ToggleOptionComponent {
  @Input() panelMenuItems: any[] = [];
  @Output() toggle = new EventEmitter<MenuEventArgs>();

  onToggle(args: MenuEventArgs): void {
    this.toggle.emit(args);
  }
}
