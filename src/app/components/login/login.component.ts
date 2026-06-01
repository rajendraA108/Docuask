import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <h1>DocuAsk</h1>
        <p class="subtitle">AI-powered document Q&A</p>

        <div class="tab-row">
          <button [class.active]="mode() === 'login'" (click)="mode.set('login')">Login</button>
          <button [class.active]="mode() === 'register'" (click)="mode.set('register')">Register</button>
        </div>

        @if (mode() === 'register') {
          <input [(ngModel)]="name" placeholder="Full name" type="text"/>
        }
        <input [(ngModel)]="email" placeholder="Email" type="email"/>
        <input [(ngModel)]="password" placeholder="Password" type="password"/>

        @if (error()) {
          <div class="error">{{ error() }}</div>
        }

        <button class="submit-btn" (click)="submit()" [disabled]="isLoading()">
          {{ isLoading() ? 'Please wait...' : mode() === 'login' ? 'Login' : 'Register' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
    }
    .login-box {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    h1 { margin: 0; font-size: 28px; }
    .subtitle { margin: 0; color: #666; font-size: 14px; }
    .tab-row { display: flex; gap: 8px; }
    .tab-row button {
      flex: 1; padding: 8px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 8px;
      cursor: pointer;
    }
    .tab-row button.active {
      background: #4f46e5;
      color: white;
      border-color: #4f46e5;
    }
    input {
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
    }
    input:focus { border-color: #4f46e5; }
    .submit-btn {
      padding: 12px;
      background: #4f46e5;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 15px;
      cursor: pointer;
    }
    .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .error {
      padding: 10px;
      background: #fee2e2;
      color: #dc2626;
      border-radius: 8px;
      font-size: 13px;
    }
  `]
})
export class LoginComponent {
  mode = signal<'login' | 'register'>('login');
  isLoading = signal(false);
  error = signal<string | null>(null);

  name = '';
  email = '';
  password = '';

  constructor(private authService: AuthService) {}

  submit() {
    this.error.set(null);
    this.isLoading.set(true);

    const obs = this.mode() === 'login'
      ? this.authService.login(this.email, this.password)
      : this.authService.register(this.name, this.email, this.password);

    obs.subscribe({
      next: () => this.isLoading.set(false),
      error: (err) => {
        this.error.set(err.error?.error || 'Something went wrong');
        this.isLoading.set(false);
      }
    });
  }
}