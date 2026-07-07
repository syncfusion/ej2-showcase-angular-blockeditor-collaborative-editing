import { Component, Input, Output, EventEmitter, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListViewModule, ListViewModel, FieldSettingsModel, SelectEventArgs } from '@syncfusion/ej2-angular-lists';

/**
 * Generic Syncfusion ListView wrapper component for Angular
 * Handles collaborators list and version history list rendering
 * 
 * Features:
 * - Flexible item templating
 * - Custom header template
 * - Loading and empty states
 * - Field mapping
 * - Selection support
 */
@Component({
  selector: 'app-syncfusion-listview',
  standalone: true,
  imports: [CommonModule, ListViewModule],
  template: `
    @if (isLoading) {
      <div [class]="'e-listview-loader ' + cssClass">
        <div class="e-spinner">
          <div class="e-spin-material"></div>
        </div>
      </div>
    } @else if (!dataSource || dataSource.length === 0) {
      <div [class]="'e-listview-empty ' + cssClass">
        <p class="empty-message">{{ emptyMessage }}</p>
      </div>
    } @else {
      <ejs-listview
        [id]="id"
        [dataSource]="dataSource"
        [fields]="fields"
        [template]="template"
        [headerTemplate]="headerTemplate"
        [groupTemplate]="groupTemplate"
        [showHeader]="showHeader"
        [headerTitle]="headerTitle"
        [cssClass]="cssClass"
        (select)="onSelect($event)"
        (actionFailure)="onActionFailure()"
      ></ejs-listview>
    }
  `,
  styles: [`
    .e-listview-loader {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: var(--sp-xl, 2rem);
    }

    .e-listview-empty {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: var(--sp-xl, 2rem);
    }

    .empty-message {
      color: var(--text-tertiary, #999);
      font-size: var(--fs-small, 0.875rem);
      text-align: center;
    }

    :host {
      display: block;
    }
  `]
})
export class SyncfusionListViewComponent implements OnInit {
  @Input() id: string = 'listview';
  @Input() dataSource: any[] = [];
  @Input() fields?: FieldSettingsModel;
  @Input() template?: TemplateRef<any> | string | Function;
  @Input() headerTemplate?: TemplateRef<any> | string | Function;
  @Input() groupTemplate?: TemplateRef<any> | string | Function;
  @Input() cssClass: string = '';
  @Input() showHeader: boolean = true;
  @Input() headerTitle?: string;
  @Input() isLoading: boolean = false;
  @Input() emptyMessage: string = 'No items to display';
  
  @Output() select = new EventEmitter<any>();
  @Output() actionFailure = new EventEmitter<void>();

  ngOnInit(): void {
    // Component initialization
  }

  onSelect(args: SelectEventArgs): void {
    if (args.data) {
      this.select.emit(args.data);
    }
  }

  onActionFailure(): void {
    console.warn(`ListView ${this.id}: Action failed`);
    this.actionFailure.emit();
  }
}
