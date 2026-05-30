import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-alert',
  standalone: true,
  imports: [CommonModule],
  template: ` 
    @if (message()) { 
      <div class="error-alert" role="alert"> 
        <svg xmlns="http://www.w3.org/2000/svg" class="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> 
        </svg> 
        <span class="error-text">{{ message() }}</span> 
        <button type="button" class="close-btn" (click)="dismiss()" aria-label="Close"> 
          &times; 
        </button> 
      </div> 
    } 
  `,
  styles: [` 
    .error-alert { 
      display: flex; 
      align-items: center; 
      background-color: #fee2e2; 
      border: 1px solid #ef4444; 
      color: #b91c1c; 
      padding: 12px 16px; 
      border-radius: 8px; 
      margin-bottom: 16px; 
      font-size: 0.9rem; 
      animation: fadeIn 0.3s ease-in-out; 
    } 
    .error-icon { 
      width: 24px; 
      height: 24px; 
      margin-right: 12px; 
      flex-shrink: 0; 
    } 
    .error-text { 
      flex-grow: 1; 
    } 
    .close-btn { 
      background: none; 
      border: none; 
      color: #b91c1c; 
      font-size: 1.5rem; 
      cursor: pointer; 
      line-height: 1; 
      padding: 0 0 0 12px; 
    } 
    .close-btn:hover { 
      color: #7f1d1d; 
    } 
    @keyframes fadeIn { 
      from { opacity: 0; transform: translateY(-5px); } 
      to { opacity: 1; transform: translateY(0); } 
    } 
  `]
})
export class ErrorAlertComponent {
  message = signal<string | null>(null);

  @Input() set errorMessage(value: string | null) {
    this.message.set(value);
  }

  dismiss() {
    this.message.set(null);
  }
}
