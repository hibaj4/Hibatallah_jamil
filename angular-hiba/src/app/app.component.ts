import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CounterComponent } from './counter/counter.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CounterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-hiba';
   ngOnInit(): void {   
    console.log('App Initialised');
  }
}
