import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Connection status indicator component
 */
@Component({
  selector: '[app-connection-status]',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="connection-status">
      <span [class]="'status-indicator ' + (isConnected ? 'connected' : 'disconnected')"></span>
      <span class="status-text">
        {{ isConnected ? 'Connected' : 'Connecting...' }}
      </span>
    </div>
  `,
  styleUrls: ['./connection-status.component.css']
})
export class ConnectionStatusComponent {
  @Input() isConnected: boolean = false;
}
