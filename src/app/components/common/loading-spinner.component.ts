import { Component, Input, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="loading-container">
      <div #spinnerHost class="spinner-host"></div>
      <p class="loading-text">{{ text }}</p>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 300px;
      gap: var(--sp-md);
    }

    .spinner-host {
      width: 50px;
      height: 50px;
    }

    .loading-text {
      color: var(--text-secondary);
      font-size: var(--fs-body);
    }
  `]
})
export class LoadingSpinnerComponent implements AfterViewInit, OnDestroy {
  @Input() text: string = 'Initializing collaboration...';
  @ViewChild('spinnerHost', { static: false }) spinnerHost!: ElementRef;

  ngAfterViewInit(): void {
    if (this.spinnerHost) {
      createSpinner({
        target: this.spinnerHost.nativeElement
      });
      showSpinner(this.spinnerHost.nativeElement);
    }
  }

  ngOnDestroy(): void {
    if (this.spinnerHost) {
      hideSpinner(this.spinnerHost.nativeElement);
    }
  }
}
