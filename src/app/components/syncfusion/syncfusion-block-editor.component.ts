import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  BlockEditorComponent, 
  BlockEditorModule, 
  BlockEditorAllModule,
  Collaboration, 
  VersionHistory 
} from '@syncfusion/ej2-angular-blockeditor';

/**
 * Wrapped Syncfusion BlockEditor component for Angular
 * Injects Collaboration and VersionHistory services
 */
@Component({
  selector: '[app-syncfusion-block-editor]',
  standalone: true,
  imports: [CommonModule, BlockEditorModule, BlockEditorAllModule],
  providers: [Collaboration, VersionHistory],
  template: `
    <ejs-blockeditor
      #blockeditor
      [id]="id"
      [height]="height"
      [width]="width"
      [blocks]="blocks"
      [currentUserId]="currentUserId"
      [collaborationSettings]="collaborationSettings"
      [users]="users"
      [inlineToolbarSettings]="inlineToolbarSettings"
      [imageBlockSettings]="imageBlockSettings"
      [className]="className"
      (created)="onCreated()"
      (blockChanged)="onBlockChanged($event)"
    ></ejs-blockeditor>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class SyncfusionBlockEditorComponent {
  @Input() id: string = 'block-editor';
  @Input() height: string = '100%';
  @Input() width: string = 'auto';
  @Input() blocks: any[] = [];
  @Input() collaborationSettings: any = null;
  @Input() users: any[] = [];
  @Input() currentUserId: string = '';
  @Input() inlineToolbarSettings: any = null;
  @Input() imageBlockSettings: any = null;
  @Input() className: string = '';
  
  @Output() created = new EventEmitter<any>();
  @Output() blockChanged = new EventEmitter<any>();

  @ViewChild('blockeditor') blockEditorInstance!: BlockEditorComponent;

  onCreated(): void {
    if (this.blockEditorInstance) {
      const versionHistory = this.blockEditorInstance.getVersionHistory();
      this.created.emit(versionHistory);
    }
  }

  onBlockChanged(event: any): void {
    this.blockChanged.emit(event);
  }

  getEditor(): BlockEditorComponent | null {
    return this.blockEditorInstance || null;
  }

  getDataAsJson(): any {
    return this.blockEditorInstance?.getDataAsJson();
  }

  getDataAsHtml(): string {
    return this.blockEditorInstance?.getDataAsHtml() || '';
  }
}
