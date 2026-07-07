import { Injectable, OnDestroy, NgZone, ChangeDetectorRef, ApplicationRef } from '@angular/core';
import { BehaviorSubject, Observable, asyncScheduler } from 'rxjs';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { CollaborationAdapter } from '../models/collaboration.model';

// Configuration
const CONFIG = {
  wsUrl: 'ws://localhost:1234',
  hostedWsUrl: 'wss://collab.syncfusion.com'
};

@Injectable({
  providedIn: 'root'
})
export class CollaborationService implements OnDestroy {
  private ydoc: Y.Doc | null = null;
  private providerSubject = new BehaviorSubject<WebsocketProvider | null>(null);
  private adapterSubject = new BehaviorSubject<CollaborationAdapter | null>(null);
  private isConnectedSubject = new BehaviorSubject<boolean>(false);
  private isSyncedSubject = new BehaviorSubject<boolean>(false);
  private syncCheckInterval: any = null;

  public provider$ = this.providerSubject.asObservable();
  public adapter$ = this.adapterSubject.asObservable();
  public isConnected$ = this.isConnectedSubject.asObservable();
  public isSynced$ = this.isSyncedSubject.asObservable();

  constructor(
    private ngZone: NgZone,
    private appRef: ApplicationRef
  ) {}

  async initialize(roomName: string): Promise<void> {
    // Initialize Yjs document
    this.ydoc = new Y.Doc();
    const yXmlFragment = this.ydoc.getXmlFragment('blockeditor');

    // Connect to WebSocket provider
    const provider = new WebsocketProvider(CONFIG.hostedWsUrl, roomName, this.ydoc);

    // Create collaboration adapter
    const adapter: CollaborationAdapter = {
      yRuntime: Y,
      yXmlFragment
    };

    // Setup connection status listener
    provider.on('status', (event: any) => {
      // Run inside Angular zone to trigger change detection properly
      this.ngZone.run(() => {
        this.isConnectedSubject.next(event.status === 'connected');
      });
    });

    // Wait for connection with fallback timeout
    await new Promise<void>((resolve) => {
      const onConnected = (event: any) => {
        if (event.status === 'connected') {
          resolve();
        }
      };
      
      provider.on('status', onConnected);

      // Fallback timeout - continue even if connection fails
      // This allows the app to work in offline mode or with connection issues
      setTimeout(() => {
        resolve();
      }, 2000);
    });

    // Update subjects first (synchronously)
    this.providerSubject.next(provider);
    this.adapterSubject.next(adapter);
    this.isConnectedSubject.next(this.getConnectionStatus(provider));

    // Monitor sync status using setInterval (matching React implementation)
    // Run completely outside Angular zone to avoid change detection issues
    this.ngZone.runOutsideAngular(() => {
      // Check if already synced first
      if (provider.synced) {
        // If already synced, schedule update for next macrotask and trigger change detection
        asyncScheduler.schedule(() => {
          this.ngZone.run(() => {
            this.isSyncedSubject.next(true);
          });
        });
      } else {
        // Poll for sync status
        this.syncCheckInterval = setInterval(() => {
          if (provider.synced) {
            // Update inside zone to trigger change detection properly
            this.ngZone.run(() => {
              this.isSyncedSubject.next(true);
            });
            clearInterval(this.syncCheckInterval);
            this.syncCheckInterval = null;
          }
        }, 100);
      }
    });
  }

  private getConnectionStatus(provider: WebsocketProvider): boolean {
    return provider.wsconnected || false;
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  cleanup(): void {
    // Clear sync check interval if still running
    if (this.syncCheckInterval) {
      clearInterval(this.syncCheckInterval);
      this.syncCheckInterval = null;
    }

    const provider = this.providerSubject.value;
    if (provider) {
      provider.disconnect();
    }
    if (this.ydoc) {
      this.ydoc.destroy();
    }
  }
}
