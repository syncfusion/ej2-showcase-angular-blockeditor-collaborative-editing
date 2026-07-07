import { Component, Input, OnChanges, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SyncfusionListViewComponent } from '../syncfusion/syncfusion-listview.component';
import { FieldSettingsModel } from '@syncfusion/ej2-angular-lists';
import { UserModel } from '../../models/user.model';

interface ListViewItem {
  id: string;
  headerText: string;
  contentText: string;
  avatarText: string;
  avatarColor: string;
}

/**
 * Active collaborators panel component
 * Uses Syncfusion ListView for rendering collaborators list
 */
@Component({
  selector: '[app-collab-panel]',
  standalone: true,
  imports: [CommonModule, SyncfusionListViewComponent],
  templateUrl: './collab-panel.component.html',
  styleUrls: ['./collab-panel.component.css']
})
export class CollabPanelComponent implements OnChanges {
  @Input() collaborators: UserModel[] = [];
  @Input() currentUser!: UserModel;

  @ViewChild('itemTemplate') itemTemplate?: TemplateRef<any>;

  listViewData: ListViewItem[] = [];
  fields: FieldSettingsModel = {
    id: 'id',
    text: 'headerText'
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collaborators'] || changes['currentUser']) {
      this.transformCollaborators();
    }
  }

  private transformCollaborators(): void {
    const allUsers = this.currentUser ? [this.currentUser, ...this.collaborators] : this.collaborators;
    this.listViewData = allUsers.map(user => ({
      id: user.id,
      headerText: user.id === this.currentUser?.id ? `${user.user} (You)` : user.user,
      contentText: 'Active',
      avatarText: this.getInitials(user.user),
      avatarColor: user.avatarBgColor
    }));
  }

  private getInitials(name: string | undefined): string {
    if (!name) return '';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
