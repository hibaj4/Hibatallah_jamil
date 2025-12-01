import { Component } from '@angular/core';

@Component({
  selector: 'app-counter',
  imports: [],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.scss'
})
export class CounterComponent {

   number: number = 0;

  increment() {
    this.number += 1;
  }
   decrement() {
    this.number -= 1;
  }

  reset() {
    this.number = 0;
  }

}
