import { Component, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorContainerComponent } from './editor-container.component';
import { SidebarContentComponent } from './sidebar-content.component';
import { SyncfusionSidebarComponent } from '../syncfusion/syncfusion-sidebar.component';
import { UserModel } from '../../models/user.model';
import { BlockEditorComponent } from '@syncfusion/ej2-angular-blockeditor';

/**
 * Main editor workspace component
 */
@Component({
  selector: 'app-editor-workspace',
  standalone: true,
  imports: [
    CommonModule,
    EditorContainerComponent,
    SidebarContentComponent,
    SyncfusionSidebarComponent
  ],
  templateUrl: './editor-workspace.component.html',
  styleUrls: ['./editor-workspace.component.css']
})
export class EditorWorkspaceComponent implements AfterViewInit {
  @Input() editorRef: BlockEditorComponent | null = null;
  @Input() roomId: string = '';
  @Input() isConnected: boolean = false;
  @Input() currentUser!: UserModel;
  @Input() collaborators: UserModel[] = [];
  @Input() blocks: any[] = [];
  @Input() collaborationSettings: any = null;
  @Input() snapshots: any[] = [];
  @Input() snapshotsLoading: boolean = false;
  @Input() inlineToolbarSettings: any = null;
  @Input() imageBlockSettings: any = null;

  @Output() restoreSnapshot = new EventEmitter<string>();
  @Output() deleteSnapshot = new EventEmitter<string>();
  @Output() renameSnapshot = new EventEmitter<{ id: string; newLabel: string }>();
  @Output() clearAllSnapshots = new EventEmitter<void>();
  @Output() created = new EventEmitter<any>();
  @Output() editorInstanceReady = new EventEmitter<BlockEditorComponent>();
  @Output() refreshVersions = new EventEmitter<void>();

  @ViewChild(EditorContainerComponent) editorContainer!: EditorContainerComponent;

  activePanel: 'collab' | 'versions' | null = null;
  private _sidebarTarget: HTMLElement | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    // Update sidebar target after view initialization to avoid expression changed errors
    this.updateSidebarTarget();
  }

  private updateSidebarTarget(): void {
    if (!this._sidebarTarget && this.editorContainer?.blockEditorComponent?.blockEditorInstance?.element?.parentElement) {
      this._sidebarTarget = this.editorContainer.blockEditorComponent.blockEditorInstance.element.parentElement;
      // Manually trigger change detection after updating the value
      this.cdr.detectChanges();
    }
  }

  get allUsers(): UserModel[] {
    return [this.currentUser, ...this.collaborators];
  }

  get collaboratorCount(): number {
    return this.collaborators.length + 1; // +1 for current user
  }

  get sidebarTarget(): HTMLElement | null {
    // Return the cached sidebar target
    return this._sidebarTarget;
  }

  handleTogglePanel(panel: 'collab' | 'versions'): void {
    // If same panel is open, close it. Otherwise, open the selected panel
    const wasOpen = this.activePanel === panel;
    this.activePanel = wasOpen ? null : panel;
    
    // Refresh version history when opening the versions panel
    if (!wasOpen && panel === 'versions') {
      this.refreshVersions.emit();
    }
  }

  handleClosePanel(): void {
    this.activePanel = null;
  }

  onRestoreSnapshot(id: string): void {
    this.restoreSnapshot.emit(id);
  }

  onDeleteSnapshot(id: string): void {
    this.deleteSnapshot.emit(id);
  }

  onRenameSnapshot(event: { id: string; newLabel: string }): void {
    this.renameSnapshot.emit(event);
  }

  onClearAllSnapshots(): void {
    this.clearAllSnapshots.emit();
  }

  onEditorCreated(versionHistory: any): void {
    this.created.emit(versionHistory);
    // Update sidebar target when editor is created
    setTimeout(() => this.updateSidebarTarget(), 0);
  }

  onEditorInstanceReady(editorInstance: BlockEditorComponent): void {
    this.editorRef = editorInstance;
    this.editorInstanceReady.emit(editorInstance);
  }
}