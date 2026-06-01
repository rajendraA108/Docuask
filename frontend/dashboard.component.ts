// src/app/components/dashboard/dashboard.component.ts
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QueryService, QueryResult } from '../../services/query.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,               // Angular 17+ standalone — no NgModule needed
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard">
      <header class="header">
        <h1>DocuAsk</h1>
        <div class="user-info">
          <span>{{ authService.currentUser()?.name }}</span>
          <button (click)="authService.logout()" class="btn-outline">Logout</button>
        </div>
      </header>

      <main class="main-content">
        <!-- Upload & Ask section -->
        <section class="ask-section">
          <h2>Ask a question about a PDF</h2>

          <!-- File drag-and-drop zone -->
          <div
            class="drop-zone"
            [class.has-file]="selectedFile()"
            (dragover)="onDragOver($event)"
            (drop)="onDrop($event)"
            (click)="fileInput.click()"
          >
            <input
              #fileInput
              type="file"
              accept=".pdf"
              hidden
              (change)="onFileSelected($event)"
            />
            @if (selectedFile()) {
              <p class="file-name">{{ selectedFile()!.name }}</p>
              <p class="file-size">{{ formatFileSize(selectedFile()!.size) }}</p>
            } @else {
              <p>Drop a PDF here or click to browse</p>
            }
          </div>

          <!-- Question input -->
          <textarea
            [(ngModel)]="question"
            placeholder="What would you like to know about this document?"
            rows="3"
            class="question-input"
          ></textarea>

          <button
            (click)="askQuestion()"
            [disabled]="isLoading() || !selectedFile() || !question.trim()"
            class="btn-primary"
          >
            {{ isLoading() ? 'Thinking...' : 'Ask AI' }}
          </button>

          @if (error()) {
            <div class="error-box">{{ error() }}</div>
          }

          <!-- AI Answer -->
          @if (lastAnswer()) {
            <div class="answer-box">
              <h3>Answer</h3>
              <p>{{ lastAnswer()!.answer }}</p>
              <small>Based on: {{ lastAnswer()!.fileName }}</small>
            </div>
          }
        </section>

        <!-- History section -->
        <section class="history-section">
          <h2>Recent questions</h2>

          @if (isLoadingHistory()) {
            <p class="loading-text">Loading history...</p>
          } @else if (history().length === 0) {
            <p class="empty-text">No questions yet. Ask your first one above!</p>
          } @else {
            <div class="history-list">
              @for (item of history(); track item.id) {
                <div class="history-item">
                  <div class="history-header">
                    <span class="file-badge">{{ item.fileName }}</span>
                    <span class="date">{{ item.createdAt | date:'MMM d, h:mm a' }}</span>
                    <button (click)="deleteQuery(item.id)" class="btn-icon" title="Delete">✕</button>
                  </div>
                  <p class="history-question">Q: {{ item.question }}</p>
                  <p class="history-answer">A: {{ item.answer }}</p>
                </div>
              }
            </div>
          }
        </section>
      </main>
    </div>
  `,
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  // Angular Signals for reactive state
  selectedFile = signal<File | null>(null);
  isLoading = signal(false);
  isLoadingHistory = signal(false);
  error = signal<string | null>(null);
  lastAnswer = signal<QueryResult | null>(null);
  history = signal<QueryResult[]>([]);

  question = '';

  constructor(
    public authService: AuthService,
    private queryService: QueryService
  ) {
    this.loadHistory();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.selectedFile.set(input.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file?.type === 'application/pdf') {
      this.selectedFile.set(file);
    }
  }

  askQuestion() {
    if (!this.selectedFile() || !this.question.trim()) return;

    this.isLoading.set(true);
    this.error.set(null);

    this.queryService.askQuestion(this.selectedFile()!, this.question).subscribe({
      next: (result) => {
        this.lastAnswer.set(result);
        this.history.update(h => [result, ...h]); // Prepend to history
        this.question = '';
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Something went wrong. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  loadHistory() {
    this.isLoadingHistory.set(true);
    this.queryService.getHistory().subscribe({
      next: (response) => {
        this.history.set(response.queries);
        this.isLoadingHistory.set(false);
      },
      error: () => this.isLoadingHistory.set(false)
    });
  }

  deleteQuery(id: string) {
    this.queryService.deleteQuery(id).subscribe({
      next: () => {
        this.history.update(h => h.filter(q => q.id !== id));
      }
    });
  }

  formatFileSize(bytes: number): string {
    return bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
