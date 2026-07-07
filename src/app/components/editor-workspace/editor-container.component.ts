import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { DropDownButtonModule, MenuEventArgs } from '@syncfusion/ej2-angular-splitbuttons';
import { SyncfusionBlockEditorComponent } from '../syncfusion/syncfusion-block-editor.component';
import { SyncfusionButtonComponent } from '../syncfusion/syncfusion-button.component';
import { ConnectionStatusComponent } from '../common/connection-status.component';
import { ExportOptionComponent } from '../toolbar/export-option.component';
import { ToggleOptionComponent } from '../toolbar/toggle-option.component';
import { CollaborationOptionComponent } from '../toolbar/collaboration-option.component';
import { TurndownServiceWrapper } from '../../services/turndown.service';
import { BlockEditorComponent } from '@syncfusion/ej2-angular-blockeditor';

/**
 * Editor container component with Syncfusion BlockEditor
 */
@Component({
  selector: 'app-editor-container',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    DropDownButtonModule,
    SyncfusionBlockEditorComponent,
    SyncfusionButtonComponent,
    ConnectionStatusComponent,
    ExportOptionComponent,
    ToggleOptionComponent,
    CollaborationOptionComponent
  ],
  templateUrl: './editor-container.component.html',
  styleUrls: ['./editor-container.component.css']
})
export class EditorContainerComponent {
  @Input() editorRef: BlockEditorComponent | null = null;
  @Input() blocks: any[] = [];
  @Input() users: any[] = [];
  @Input() currentUserId: string = '';
  @Input() collaborationSettings: any = null;
  @Input() roomId: string = '';
  @Input() isConnected: boolean = false;
  @Input() collaboratorCount: number = 0;
  @Input() activePanel: 'collab' | 'versions' | null = null;
  @Input() inlineToolbarSettings: any = null;
  @Input() imageBlockSettings: any = null;

  @Output() panelToggle = new EventEmitter<'collab' | 'versions'>();
  @Output() created = new EventEmitter<any>();
  @Output() editorInstanceReady = new EventEmitter<BlockEditorComponent>();

  @ViewChild(SyncfusionBlockEditorComponent) blockEditorComponent!: SyncfusionBlockEditorComponent;

  exportMenuItems = [
    { text: 'Export as JSON', id: 'export-json', iconCss: 'e-icons e-download' },
    { text: 'Export as HTML', id: 'export-html', iconCss: 'e-icons e-download' },
    { text: 'Export as Markdown', id: 'export-markdown', iconCss: 'e-icons e-download' }
  ];

  panelMenuItems = [
    { text: 'Active Collaborators', id: 'show-collaborators', iconCss: 'e-icons e-people' },
    { text: 'Version History', id: 'show-versions', iconCss: 'e-icons e-history' }
  ];

  constructor(private turndownService: TurndownServiceWrapper) {}

  handleExport(args: MenuEventArgs): void {
    if (!this.blockEditorComponent?.blockEditorInstance || !args.item?.text) {
      return;
    }

    const selected = args.item.text.toLowerCase();
    const format = selected.includes('json') ? 'json' : 
                   (selected.includes('markdown') ? 'markdown' : 'html');

    try {
      if (format === 'json') {
        const data = this.blockEditorComponent.getDataAsJson();
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: 'application/json'
        });
        this.downloadFile(blob, `editor-${Date.now()}.json`);
      } else if (format === 'html') {
        const data = this.blockEditorComponent.getDataAsHtml();
        const blob = new Blob([data], { type: 'text/html' });
        this.downloadFile(blob, `editor-${Date.now()}.html`);
      } else if (format === 'markdown') {
        const htmlContent = this.blockEditorComponent.getDataAsHtml();
        const markdownContent = this.turndownService.turndown(htmlContent || '');
        const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
        this.downloadFile(blob, `editor-${Date.now()}.md`);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  }

  handlePanelToggle(args: MenuEventArgs): void {
    const action = args.item.id;
    if (action === 'show-collaborators') {
      this.panelToggle.emit('collab');
    } else if (action === 'show-versions') {
      this.panelToggle.emit('versions');
    }
  }

  onEditorCreated(versionHistory: any): void {
    this.created.emit(versionHistory);
    // Emit the editor instance so parent can access it
    if (this.blockEditorComponent?.blockEditorInstance) {
      this.editorInstanceReady.emit(this.blockEditorComponent.blockEditorInstance);
    }
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
