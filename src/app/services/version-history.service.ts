import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IndexedDBVersionStorage } from './version-history-storage.service';

@Injectable({
  providedIn: 'root'
})
export class VersionHistoryService {
  private snapshotsSubject = new BehaviorSubject<any[]>([]);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<Error | null>(null);

  public snapshots$: Observable<any[]> = this.snapshotsSubject.asObservable();
  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();
  public error$: Observable<Error | null> = this.errorSubject.asObservable();

  private versionPlugin: any | null = null;
  private storage: IndexedDBVersionStorage | null = null;

  setVersionPlugin(plugin: any): void {
    this.versionPlugin = plugin;
    this.refreshSnapshots();
  }

  setStorage(storage: IndexedDBVersionStorage): void {
    this.storage = storage;
  }

  async refreshSnapshots(): Promise<void> {
    if (!this.versionPlugin || !this.storage) {
      return;
    }

    try {
      this.isLoadingSubject.next(true);
      const snapshots = this.versionPlugin.getSnapshots();
      this.snapshotsSubject.next(snapshots);
      this.errorSubject.next(null);
    } catch (err) {
      this.errorSubject.next(
        err instanceof Error ? err : new Error(String(err))
      );
    } finally {
      this.isLoadingSubject.next(false);
    }
  }

  async createSnapshot(label: string, lastModifiedBy: string): Promise<void> {
    if (!this.versionPlugin) {
      return;
    }

    try {
      this.isLoadingSubject.next(true);
      await this.versionPlugin.createSnapshot({
        label,
        modifiedBy: lastModifiedBy
      });
      await this.refreshSnapshots();
    } catch (err) {
      this.errorSubject.next(
        err instanceof Error ? err : new Error(String(err))
      );
    } finally {
      this.isLoadingSubject.next(false);
    }
  }

  async restoreSnapshot(snapshotId: string): Promise<void> {
    if (!this.versionPlugin) {
      return;
    }

    try {
      this.isLoadingSubject.next(true);
      await this.versionPlugin.restoreSnapshot(snapshotId);
      await this.refreshSnapshots();
    } catch (err) {
      this.errorSubject.next(
        err instanceof Error ? err : new Error(String(err))
      );
    } finally {
      this.isLoadingSubject.next(false);
    }
  }

  async deleteSnapshot(snapshotId: string): Promise<void> {
    if (!this.versionPlugin) {
      return;
    }

    try {
      this.isLoadingSubject.next(true);
      await this.versionPlugin.deleteSnapshot(snapshotId);
      await this.refreshSnapshots();
    } catch (err) {
      this.errorSubject.next(
        err instanceof Error ? err : new Error(String(err))
      );
    } finally {
      this.isLoadingSubject.next(false);
    }
  }

  async renameSnapshot(snapshotId: string, newLabel: string): Promise<void> {
    if (!this.versionPlugin) {
      return;
    }

    try {
      this.isLoadingSubject.next(true);
      await this.versionPlugin.renameSnapshot(snapshotId, newLabel);
      await this.refreshSnapshots();
    } catch (err) {
      this.errorSubject.next(
        err instanceof Error ? err : new Error(String(err))
      );
    } finally {
      this.isLoadingSubject.next(false);
    }
  }

  async clearAllSnapshots(): Promise<void> {
    if (!this.storage) {
      return;
    }

    try {
      this.isLoadingSubject.next(true);

      // Delete all snapshots from storage and version plugin
      const snapshots = this.snapshotsSubject.value;
      for (const snapshot of snapshots) {
        try {
          if (this.versionPlugin) {
            await this.versionPlugin.deleteSnapshot(snapshot.id);
          }
        } catch (err) {
          console.warn(`Failed to delete snapshot ${snapshot.id}:`, err);
        }
      }

      // Clear storage
      await this.storage.clearAll();

      // Refresh snapshots list
      this.snapshotsSubject.next([]);
      this.errorSubject.next(null);
    } catch (err) {
      this.errorSubject.next(
        err instanceof Error ? err : new Error(String(err))
      );
    } finally {
      this.isLoadingSubject.next(false);
    }
  }
}
