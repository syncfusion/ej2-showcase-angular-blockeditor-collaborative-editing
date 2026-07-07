import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SyncfusionButtonComponent } from '../syncfusion/syncfusion-button.component';
import { VersionHistoryListComponent } from '../version-history/version-history-list.component';
import { CollabPanelComponent } from '../active-collab-panel/collab-panel.component';
import { UserModel } from '../../models/user.model';
import { BlockEditorComponent } from '@syncfusion/ej2-angular-blockeditor';

type SidebarMode = 'collaborators' | 'versions';

/**
 * Unified sidebar content component
 * Renders either Version History or Active Collaborators based on mode
 */
@Component({
  selector: 'app-sidebar-content',
  standalone: true,
  imports: [
    CommonModule,
    SyncfusionButtonComponent,
    VersionHistoryListComponent,
    CollabPanelComponent
  ],
  templateUrl: './sidebar-content.component.html',
  styleUrls: ['./sidebar-content.component.css']
})
export class SidebarContentComponent {
  @Input() mode: SidebarMode = 'versions';
  @Input() editorRef: BlockEditorComponent | null = null;
  @Input() collaborators: UserModel[] = [];
  @Input() currentUser!: UserModel;
  @Input() snapshots: any[] = [];
  @Input() isLoading: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() restore = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  @Output() rename = new EventEmitter<{ id: string; newLabel: string }>();
  @Output() clearAll = new EventEmitter<void>();

  isClearing: boolean = false;

  getHeaderTitle(): string {
    return this.mode === 'collaborators' ? 'Active Collaborators' : 'Version History';
  }

  hasHeaderActions(): boolean {
    return this.mode === 'versions' && this.snapshots.length > 0;
  }

  async handleClearAll(): Promise<void> {
    if (this.snapshots.length === 0) {
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to delete all ${this.snapshots.length} snapshot(s)? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        this.isClearing = true;
        this.clearAll.emit();
      } catch (err) {
        console.error('Failed to clear all snapshots:', err);
      } finally {
        this.isClearing = false;
      }
    }
  }

  onRestore(id: string): void {
    this.restore.emit(id);
  }

  onDelete(id: string): void {
    this.delete.emit(id);
  }

  onRename(event: { id: string; newLabel: string }): void {
    this.rename.emit(event);
  }

  onClose(): void {
    this.close.emit();
  }
}
