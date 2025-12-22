import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({ providedIn: 'root' })
export class BookService {
  private apiUrl = 'http://localhost:3000/books';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  getById(id: string): Observable<Book> {
  return this.http.get<Book>(`${this.apiUrl}/${id}`);
}

  create(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  update(id: string, book: Book): Observable<Book> {
  return this.http.put<Book>(`${this.apiUrl}/${id}`, book);
}

  delete(id: string): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}

}




