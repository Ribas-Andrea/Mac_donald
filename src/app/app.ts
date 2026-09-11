import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Carte } from './components/carte/carte';

@Component({
  imports: [RouterOutlet, Carte],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('mac_donald_frontend_angular');
}
