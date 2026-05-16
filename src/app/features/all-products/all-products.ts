import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { PipeNamePipe } from '../../pipe-name-pipe';
import { ProductsService } from './products';
import { product } from '../../shared/models/auth.model';

@Component({
  selector: 'app-all-products',
  imports: [CurrencyPipe, UpperCasePipe, PipeNamePipe],
  templateUrl: './all-products.html',
  styleUrl: './all-products.css',
})
export class AllProducts implements OnInit {
  products: product[] = [];

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.productsService.getProducts().subscribe(response => {
      this.products = response.items;
    });
  }
}