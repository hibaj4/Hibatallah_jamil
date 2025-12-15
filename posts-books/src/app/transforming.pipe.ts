import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transforming'
})
export class TransformingPipe implements PipeTransform {

 
   transform(book: any): string {
    return `The name of the book is :${book.name.toUpperCase()}`;
  }

}
