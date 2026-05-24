import { Component } from '@angular/core';
import { Hero } from './hero/hero';
import { Categories } from './categories/categories';
import { FeaturedProductsComponent } from './featured-products/featured-products';
@Component({
  selector: 'app-home',
  imports: [Hero, Categories,FeaturedProductsComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
