/**
 * Simple IndexedDB-based storage for version snapshots.
 * Implements IVersionStorage for persistence across browser sessions.
 */
export class IndexedDBVersionStorage {
  private dbName: string = '';
  private storeName: string = 'snapshots';
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void>;

  constructor(dbName: string) {
    this.dbName = dbName;
    this.initPromise = this.initialize();
  }

  /**
   * Initialize the IndexedDB database schema.
   */
  private initialize(): Promise<void> {
    return new Promise((resolve, reject): void => {
      const request: IDBOpenDBRequest = indexedDB.open(this.dbName, 1);

      request.onerror = (): void => {
        reject(new Error('Failed to open IndexedDB: ' + request.error));
      };

      request.onsuccess = (): void => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent): void => {
        const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store: IDBObjectStore = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('lastModifiedAt', 'lastModifiedAt', { unique: false });
        }
      };
    });
  }

  /**
   * Persist a snapshot.
   */
  async saveSnapshot(snapshot: any): Promise<void> {
    await this.initPromise;
    if (!this.db) {
      throw new Error('IndexedDB not initialized');
    }

    return new Promise((resolve, reject): void => {
      const tx: IDBTransaction = this.db!.transaction(this.storeName, 'readwrite');
      const store: IDBObjectStore = tx.objectStore(this.storeName);
      const request: IDBRequest = store.put(snapshot);

      request.onerror = (): void => {
        reject(new Error('Failed to save snapshot: ' + request.error));
      };

      request.onsuccess = (): void => {
        resolve();
      };
    });
  }

  /**
   * Load all snapshots ordered by timestamp.
   */
  async loadAllSnapshots(): Promise<any[]> {
    await this.initPromise;
    if (!this.db) {
      throw new Error('IndexedDB not initialized');
    }

    return new Promise((resolve, reject): void => {
      const tx: IDBTransaction = this.db!.transaction(this.storeName, 'readonly');
      const store: IDBObjectStore = tx.objectStore(this.storeName);
      const index: IDBIndex = store.index('lastModifiedAt');
      const request: IDBRequest = index.getAll();

      request.onerror = (): void => {
        reject(new Error('Failed to load snapshots: ' + request.error));
      };

      request.onsuccess = (): void => {
        resolve((request.result as any[]) || []);
      };
    });
  }

  /**
   * Load a single snapshot by id.
   */
  async loadSnapshot(id: string): Promise<any | null> {
    await this.initPromise;
    if (!this.db) {
      throw new Error('IndexedDB not initialized');
    }

    return new Promise((resolve, reject): void => {
      const tx: IDBTransaction = this.db!.transaction(this.storeName, 'readonly');
      const store: IDBObjectStore = tx.objectStore(this.storeName);
      const request: IDBRequest = store.get(id);

      request.onerror = (): void => {
        reject(new Error('Failed to load snapshot: ' + request.error));
      };

      request.onsuccess = (): void => {
        resolve((request.result as any) || null);
      };
    });
  }

  /**
   * Delete a snapshot by id.
   */
  async deleteSnapshot(id: string): Promise<void> {
    await this.initPromise;
    if (!this.db) {
      throw new Error('IndexedDB not initialized');
    }

    return new Promise((resolve, reject): void => {
      const tx: IDBTransaction = this.db!.transaction(this.storeName, 'readwrite');
      const store: IDBObjectStore = tx.objectStore(this.storeName);
      const request: IDBRequest = store.delete(id);

      request.onerror = (): void => {
        reject(new Error('Failed to delete snapshot: ' + request.error));
      };

      request.onsuccess = (): void => {
        resolve();
      };
    });
  }

  /**
   * Clear all snapshots from storage.
   */
  async clearAll(): Promise<void> {
    await this.initPromise;
    if (!this.db) {
      throw new Error('IndexedDB not initialized');
    }

    return new Promise((resolve, reject): void => {
      const tx: IDBTransaction = this.db!.transaction(this.storeName, 'readwrite');
      const store: IDBObjectStore = tx.objectStore(this.storeName);
      const request: IDBRequest = store.clear();

      request.onerror = (): void => {
        reject(new Error('Failed to clear storage: ' + request.error));
      };

      request.onsuccess = (): void => {
        resolve();
      };
    });
  }

  /**
   * Wait for initialization to complete.
   */
  async ready(): Promise<void> {
    return this.initPromise;
  }

  /**
   * Destroy storage and close DB connection.
   */
  destroy(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}
