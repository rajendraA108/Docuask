// src/app/services/query.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface QueryResult {
  id: string;
  _id?: string; 
  fileName: string;
  question: string;
  answer: string;
  createdAt: string;
}

export interface HistoryResponse {
  queries: QueryResult[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

@Injectable({ providedIn: 'root' })
export class QueryService {
  private apiUrl = `${environment.apiUrl}/queries`;

  constructor(private http: HttpClient) {}

  /**
   * Uploads a PDF and sends a question — returns the AI answer.
   * Uses FormData because we're sending a file + text together.
   */
  askQuestion(file: File, question: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('question', question);

    return this.http.post<QueryResult>(`${this.apiUrl}/ask`, formData);
    // Note: do NOT set Content-Type header manually — Angular sets it with the
    // correct boundary for multipart/form-data automatically
  }

  getHistory(page = 1, limit = 10) {
    return this.http.get<HistoryResponse>(
      `${this.apiUrl}/history?page=${page}&limit=${limit}`
    );
  }

  deleteQuery(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
