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
  templateUrl: './dashboard.component.html',
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
        const normalized = { ...result, id: result._id ?? result.id };
        this.lastAnswer.set(normalized);
        this.history.update(h => [normalized, ...h]); // Prepend to history
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
        const normalized = response.queries.map(q => ({
          ...q,
          id: q._id ?? q.id
        }));
        this.history.set(normalized);
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
