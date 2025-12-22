import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { BookService } from '../services/book.service';
import { Book } from '../models/book.model';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <h2>Books</h2>
    <a routerLink="/create">➕ Add Book</a>

    <ul *ngIf="books$ | async as books; else loading">
      <li *ngFor="let book of books">
        {{ book.title }} - {{ book.author }} ({{ book.price }} DH)
        <a [routerLink]="['/edit', book.id]">✏️</a>
        <button (click)="delete(book.id!)">🗑️</button>
      </li>
    </ul>

    <ng-template #loading>
      <p>Chargement des livres...</p>
    </ng-template>
  `
})
export class BookListComponent {
  books$: Observable<Book[]>;

  constructor(private service: BookService) {
    this.books$ = this.service.getAll();
  }

  delete(id: string) {
    this.service.delete(id).subscribe(() => {
      this.books$ = this.service.getAll();
    });
  }
}
