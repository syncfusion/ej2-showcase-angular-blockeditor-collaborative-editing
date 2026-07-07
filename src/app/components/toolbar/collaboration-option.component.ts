import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { getCollaborationUrl, copyToClipboard } from '../../utils/url-helpers';

/**
 * Collaboration toolbar component with room URL and controls
 */
@Component({
  selector: '[app-collaboration-option]',
  standalone: true,
  imports: [CommonModule, TextBoxModule, ButtonModule],
  templateUrl: './collaboration-option.component.html',
  styleUrls: ['./collaboration-option.component.css']
})
export class CollaborationOptionComponent {
  @Input() roomId: string = '';
  @Input() isConnected: boolean = false;

  copied: boolean = false;

  get collaborationUrl(): string {
    return getCollaborationUrl(this.roomId);
  }

  async handleCopyLink(): Promise<void> {
    try {
      await copyToClipboard(this.collaborationUrl);
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  }
}
