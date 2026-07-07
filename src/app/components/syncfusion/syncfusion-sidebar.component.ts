import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent, SidebarModule } from '@syncfusion/ej2-angular-navigations';

/**
 * Generic wrapped Syncfusion Sidebar component for Angular
 * Used for slide-out panels with smooth animations
 */
@Component({
  selector: 'app-syncfusion-sidebar',
  standalone: true,
  imports: [CommonModule, SidebarModule],
  template: `
    <ejs-sidebar
      #sidebar
      [id]="id"
      [width]="width"
      [type]="type"
      [target]="target"
      [showBackdrop]="showBackdrop"
      [position]="position"
      [class]="'syncfusion-sidebar ' + className"
      [style.visibility]="'hidden'"
      (close)="onClose()"
      (created)="onCreated()"
    >
      <ng-content></ng-content>
    </ejs-sidebar>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SyncfusionSidebarComponent implements AfterViewInit, OnChanges {
  @Input() id: string = 'sidebar';
  @Input() width: string = '300px';
  @Input() type: string = 'Push';
  @Input() target: string | HTMLElement | null = null;
  @Input() showBackdrop: boolean = true;
  @Input() isOpen: boolean = false;
  @Input() position: string = 'Right';
  @Input() className: string = '';

  @Output() sidebarClose = new EventEmitter<void>();

  @ViewChild('sidebar') sidebarInstance!: SidebarComponent;

  ngAfterViewInit(): void {
    // Initial state handled in ngOnChanges
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.sidebarInstance) {
      if (this.isOpen) {
        this.sidebarInstance.show();
      } else {
        this.sidebarInstance.hide();
      }
    }
  }

  onClose(): void {
    this.sidebarClose.emit();
  }

  onCreated(): void {
    if (this.sidebarInstance && this.sidebarInstance.element) {
      (this.sidebarInstance.element as HTMLElement).style.visibility = '';
    }
  }
}
