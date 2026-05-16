import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './core/header/header';
import { Footer } from './core/footer/footer'; 
import { CurrencyPipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, CurrencyPipe, UpperCasePipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('UTA');
  protected readonly productName = signal('სმარტფონი iUTA');
  protected readonly productPrice = signal(2499.99);
  protected readonly productRating = signal(4);
}