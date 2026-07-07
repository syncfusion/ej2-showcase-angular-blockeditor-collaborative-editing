import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';

/**
 * Lightweight rename modal dialog component for Angular
 */
@Component({
  selector: 'app-label-rename-modal',
  standalone: true,
  imports: [CommonModule, ButtonModule, TextBoxModule],
  templateUrl: './label-rename-modal.component.html',
  styleUrls: ['./label-rename-modal.component.css']
})
export class LabelRenameModalComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Input() value: string = '';
  @Input() title: string = 'Rename Snapshot';

  @Output() valueChange = new EventEmitter<string>();
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  localValue: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.localValue = this.value;
    }
  }

  onValueChange(event: any): void {
    this.localValue = event.value || '';
    this.valueChange.emit(this.localValue);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.localValue.trim()) {
      this.onSave();
    }
    if (event.key === 'Escape') {
      this.onCancel();
    }
  }

  onSave(): void {
    this.save.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
