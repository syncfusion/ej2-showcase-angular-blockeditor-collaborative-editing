import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { LoadingSpinnerComponent } from './components/common/loading-spinner.component';
import { EditorWorkspaceComponent } from './components/editor-workspace/editor-workspace.component';

import { RoomIdService } from './services/room-id.service';
import { CollaborationService } from './services/collaboration.service';
import { AwarenessService } from './services/awareness.service';
import { UserService } from './services/user.service';
import { EditorService } from './services/editor.service';
import { VersionHistoryService } from './services/version-history.service';
import { IndexedDBVersionStorage } from './services/version-history-storage.service';

import { UserModel } from './models/user.model';
import { BlockEditorComponent } from '@syncfusion/ej2-angular-blockeditor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeroComponent,
    LoadingSpinnerComponent,
    EditorWorkspaceComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @ViewChild(EditorWorkspaceComponent) editorWorkspace!: EditorWorkspaceComponent;

  roomId: string = '';
  currentUser!: UserModel;
  defaultBlocks: any[] = [];
  inlineToolbarSettings: any = null;
  imageBlockSettings: any = null;
  collaborationSettings: any = null;
  isReady: boolean = false;

  collaborators: UserModel[] = [];
  isConnected: boolean = false;
  isSynced: boolean = false;

  // Version history
  snapshots: any[] = [];
  snapshotsLoading: boolean = false;

  // Editor reference
  editorRef: BlockEditorComponent | null = null;

  constructor(
    private roomIdService: RoomIdService,
    private collaborationService: CollaborationService,
    private awarenessService: AwarenessService,
    private userService: UserService,
    private editorService: EditorService,
    private versionHistoryService: VersionHistoryService
  ) {}

  async ngOnInit(): Promise<void> {
    // Get current user
    this.currentUser = this.userService.getCurrentUser();

    // Get default blocks and settings
    this.defaultBlocks = this.editorService.getDefaultBlocks();
    this.inlineToolbarSettings = this.editorService.getInlineToolbarSettings();
    this.imageBlockSettings = this.editorService.getImageBlockSettings();

    // Get room ID
    this.roomId = this.roomIdService.roomId;

    // Initialize collaboration
    await this.collaborationService.initialize(this.roomId);

    // Create storage
    const storage = new IndexedDBVersionStorage(`blockeditor-versions-${this.roomId}`);
    this.versionHistoryService.setStorage(storage);

    // Subscribe to collaboration state
    combineLatest([
      this.collaborationService.provider$,
      this.collaborationService.adapter$,
      this.collaborationService.isSynced$
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([provider, adapter, isSynced]) => {
        this.isSynced = isSynced;

        if (provider && adapter && isSynced) {
          // Initialize awareness
          this.awarenessService.initialize(provider, this.currentUser);

          // Build collaboration settings
          this.collaborationSettings = {
            provider: provider,
            adapter: {
              yRuntime: adapter.yRuntime,
              yXmlFragment: adapter.yXmlFragment,
            },
            enableAwareness: true,
            versionHistory: {
              storage: storage,
              snapshotInterval: 3000,
              snapshotCreated: () => {
                this.versionHistoryService.refreshSnapshots();
              },
              snapshotRestored: () => {
                this.versionHistoryService.refreshSnapshots();
              },
            },
          };

          this.isReady = true;
        }
      });

    // Subscribe to connection status
    this.collaborationService.isConnected$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isConnected => {
        this.isConnected = isConnected;
      });

    // Subscribe to collaborators
    this.awarenessService.collaborators$
      .pipe(takeUntil(this.destroy$))
      .subscribe(collaborators => {
        this.collaborators = collaborators;
      });

    // Subscribe to version history snapshots
    this.versionHistoryService.snapshots$
      .pipe(takeUntil(this.destroy$))
      .subscribe(snapshots => {
        this.snapshots = snapshots;
      });

    // Subscribe to version history loading state
    this.versionHistoryService.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLoading => {
        this.snapshotsLoading = isLoading;
      });
  }

  async onRestoreSnapshot(snapshotId: string): Promise<void> {
    await this.versionHistoryService.restoreSnapshot(snapshotId);
  }

  async onDeleteSnapshot(snapshotId: string): Promise<void> {
    await this.versionHistoryService.deleteSnapshot(snapshotId);
  }

  async onRenameSnapshot(event: { id: string; newLabel: string }): Promise<void> {
    await this.versionHistoryService.renameSnapshot(event.id, event.newLabel);
  }

  async onClearAllSnapshots(): Promise<void> {
    await this.versionHistoryService.clearAllSnapshots();
  }

  onRefreshVersions(): void {
    this.versionHistoryService.refreshSnapshots();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.collaborationService.cleanup();
    this.awarenessService.cleanup();
  }

  onEditorCreated(versionHistory: any): void {
    if (versionHistory) {
      this.versionHistoryService.setVersionPlugin(versionHistory);
    }
  }
}
