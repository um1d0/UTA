import { Component } from '@angular/core';
import { Hero } from './hero/hero';
import { Categories } from './categories/categories';
@Component({
  selector: 'app-home',
  imports: [Hero, Categories],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
