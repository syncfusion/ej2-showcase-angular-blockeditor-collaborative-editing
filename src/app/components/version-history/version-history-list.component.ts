import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SyncfusionListViewComponent } from '../syncfusion/syncfusion-listview.component';
import { DropDownButtonModule, MenuEventArgs } from '@syncfusion/ej2-angular-splitbuttons';
import { FieldSettingsModel } from '@syncfusion/ej2-angular-lists';
import { LabelRenameModalComponent } from './label-rename-modal.component';
import { BlockEditorComponent } from '@syncfusion/ej2-angular-blockeditor';

interface VersionHistoryItem {
  id: string;
  headerText: string;
  label: string;
  isAutoLabel: boolean;
  timestamp: string;
  userName: string;
  lastModifiedBy: string;
  lastModifiedAt: number;
  dateGroup: string;
}

/**
 * Version History List component using Syncfusion ListView
 * Displays version snapshots with actions for restore, rename, and delete
 */
@Component({
  selector: '[app-version-history-list]',
  standalone: true,
  imports: [
    CommonModule,
    SyncfusionListViewComponent,
    DropDownButtonModule,
    LabelRenameModalComponent
  ],
  templateUrl: './version-history-list.component.html',
  styleUrls: ['./version-history-list.component.css']
})
export class VersionHistoryListComponent implements OnChanges {
  @Input() editorRef: BlockEditorComponent | null = null;
  
  // Use setter to detect all snapshot updates (including async)
  private _snapshots: any[] = [];
  @Input() 
  set snapshots(value: any[]) {
    this._snapshots = value;
    this.transformSnapshots();
  }
  get snapshots(): any[] {
    return this._snapshots;
  }
  
  @Input() isLoading: boolean = false;

  @Output() restore = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  @Output() rename = new EventEmitter<{ id: string; newLabel: string }>();

  @ViewChild('itemTemplate') itemTemplate?: TemplateRef<any>;
  @ViewChild('groupTemplate') groupTemplate?: TemplateRef<any>;

  listViewData: VersionHistoryItem[] = [];
  fields: FieldSettingsModel = {
    id: 'id',
    text: 'headerText',
    groupBy: 'dateGroup'
  };

  // Rename dialog state
  showRenameDialog: boolean = false;
  renamingId: string | null = null;
  newLabel: string = '';

  // Menu items for dropdown
  menuItems = [
    { text: 'Restore', id: 'restore', iconCss: 'e-icons e-redo' },
    { text: 'Rename', id: 'rename', iconCss: 'e-icons e-edit' },
    { separator: true },
    { text: 'Delete', id: 'delete', iconCss: 'e-icons e-trash' }
  ];

  ngOnChanges(changes: SimpleChanges): void {
    // Re-transform when editorRef changes (snapshots handled by setter)
    if (changes['editorRef'] && !changes['editorRef'].firstChange) {
      this.transformSnapshots();
    }
  }

  private transformSnapshots(): void {
    this.listViewData = this.snapshots.map(snapshot => ({
      id: snapshot.id,
      headerText: snapshot.label || this.formatTimestamp(snapshot.lastModifiedAt),
      label: snapshot.label || '',
      isAutoLabel: !snapshot.label,
      timestamp: this.formatTimestamp(snapshot.lastModifiedAt),
      userName: this.getUserName(snapshot.lastModifiedBy),
      lastModifiedBy: snapshot.lastModifiedBy,
      lastModifiedAt: snapshot.lastModifiedAt,
      dateGroup: this.getDateGroup(snapshot.lastModifiedAt)
    }));
  }

  private getDateGroup(timestamp: number): string {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateString = date.toDateString();
    const todayString = today.toDateString();
    const yesterdayString = yesterday.toDateString();

    if (dateString === todayString) return 'Today';
    if (dateString === yesterdayString) return 'Yesterday';

    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 7) return 'This Week';
    if (diffDays < 30) return 'This Month';

    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
  }

  private formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private getUserName(userId: string): string {
    if (!this.editorRef?.users) return 'Unknown';
    const foundUser = this.editorRef.users.find((user: any) => user.id === userId);
    return foundUser ? (foundUser.user as string) : 'Unknown';
  }

  handleMenuAction(snapshotId: string, args: MenuEventArgs): void {
    const action = args.item.id as string;
    
    switch (action) {
      case 'restore':
        this.restore.emit(snapshotId);
        break;
      case 'rename':
        const snapshot = this.snapshots.find(s => s.id === snapshotId);
        if (snapshot) {
          this.renamingId = snapshotId;
          this.newLabel = snapshot.label || '';
          this.showRenameDialog = true;
        }
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this version? This action cannot be undone.')) {
          this.delete.emit(snapshotId);
        }
        break;
    }
  }

  onRenameSave(): void {
    if (this.renamingId && this.newLabel.trim() !== '') {
      this.rename.emit({ id: this.renamingId, newLabel: this.newLabel });
    }
    this.closeRenameDialog();
  }

  onRenameCancel(): void {
    this.closeRenameDialog();
  }

  onLabelChange(value: string): void {
    this.newLabel = value;
  }

  private closeRenameDialog(): void {
    this.showRenameDialog = false;
    this.renamingId = null;
    this.newLabel = '';
  }
}
