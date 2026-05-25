import { Component } from '@angular/core';
import { Hero } from './hero/hero';
import { Categories } from './categories/categories';
import { FeaturedProducts } from './featured-products/featured-products';
@Component({
  selector: 'app-home',
  imports: [Hero, Categories,FeaturedProducts,],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
