import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Recherche } from './components/recherche/recherche';

@Component({
  imports: [RouterOutlet, Recherche],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {

  villeRecue = '';

  protected readonly title = signal('mac_donald_frontend_angular');


}
