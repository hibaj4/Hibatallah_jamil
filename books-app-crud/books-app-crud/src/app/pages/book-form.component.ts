import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../services/book.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>{{ isEdit ? 'Edit Book' : 'Create Book' }}</h2>

    <form [formGroup]="form" (ngSubmit)="save()">
      <input placeholder="Title" formControlName="title" />
      <input placeholder="Author" formControlName="author" />
      <input type="number" placeholder="Price" formControlName="price" />
      <button type="submit">Save</button>
    </form>
  `
})
export class BookFormComponent implements OnInit {

  form!: FormGroup;
  isEdit = false;
  bookId!: string;

  constructor(
    private fb: FormBuilder,
    private service: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {}


ngOnInit() {
  this.form = this.fb.group({
    title: ['', Validators.required],
    author: ['', Validators.required],
    price: [0, Validators.required]
  });

  const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this.bookId = id;
    this.isEdit = true;
    this.service.getById(id).subscribe(book => {
      this.form.patchValue(book);
    });
  }
}

  save() {
    if (this.form.invalid) return;

    const book = {
      title: this.form.value.title!,
      author: this.form.value.author!,
      price: this.form.value.price!
    };

    if (this.isEdit) {
      this.service.update(this.bookId, book).subscribe(() => {
        this.router.navigate(['/']);
      });
    } else {
      this.service.create(book).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }
}
