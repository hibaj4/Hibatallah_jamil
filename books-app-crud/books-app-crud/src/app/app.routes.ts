import { Routes } from '@angular/router';
import { BookListComponent } from './pages/book-list.component';
import { BookFormComponent } from './pages/book-form.component';

export const routes: Routes = [
  { path: '', component: BookListComponent },
  { path: 'create', component: BookFormComponent },
  { path: 'edit/:id', component: BookFormComponent }
];
