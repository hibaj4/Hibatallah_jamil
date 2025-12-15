import { Component } from '@angular/core';
import { TransformingPipe } from '../transforming.pipe';

@Component({
  selector: 'app-list-books',
  imports: [TransformingPipe],
  templateUrl: './list-books.component.html',
  styleUrl: './list-books.component.scss'
})
export class ListBooksComponent {

  books = [{name : "reminder of him ", publishingYear : 2023 },{name : "it ends with us ", publishingYear : 2019 },{name : "Les nuits blanches", publishingYear : 2020 }]

}
