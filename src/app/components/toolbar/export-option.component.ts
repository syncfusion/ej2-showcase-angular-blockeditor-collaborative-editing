import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropDownButtonModule, MenuEventArgs } from '@syncfusion/ej2-angular-splitbuttons';

/**
 * Export options dropdown component
 * Matches React's ExportOption component using Syncfusion DropDownButton
 */
@Component({
  selector: 'app-export-option',
  standalone: true,
  imports: [CommonModule, DropDownButtonModule],
  template: `
    <div class="toolbar-left">
      <button ejs-dropdownbutton
        [items]="exportMenuItems"
        (select)="onExport($event)"
        cssClass="export-button e-small"
        iconCss="e-icons e-download">
        Export
      </button>
    </div>
  `,
  styles: [`
    .toolbar-left {
      display: flex;
      align-items: center;
    }
  `]
})
export class ExportOptionComponent {
  @Input() exportMenuItems: any[] = [];
  @Output() export = new EventEmitter<MenuEventArgs>();

  onExport(args: MenuEventArgs): void {
    this.export.emit(args);
  }
}
