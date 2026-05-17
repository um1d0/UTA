import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { PipeNamePipe } from '../../pipe-name-pipe';
import { ProductsService } from './products';
import { product } from '../../shared/models/auth.model';
import { HttpClient } from '@angular/common/http';
import { apiInterceptor } from '../../api-interceptor';

@Component({
  selector: 'app-all-products',
  imports: [CurrencyPipe, UpperCasePipe, PipeNamePipe],
  templateUrl: './all-products.html',
  styleUrl: './all-products.css',
})
export class AllProducts implements OnInit {
  private http = inject(HttpClient);

  productsList = signal<any>(null);
  Reviews = signal<any>(null);
  ngOnInit() {
    this.getProducts();
  }
  getProducts() {
    this.http
      .get('https://shopapi.stepacademy.ge/api/products')
      .subscribe({ next: (data: any) => this.productsList.set(data) });
  }
  getReviews() {
    this.http
      .get(`https://shopapi.stepacademy.ge/api/reviews/${isNgTemplate.id}`)
      .subscribe({ next: (data: any) => this.Reviews.set(data) });
  }
}

// products: product[] = [];

// constructor(private productsService: ProductsService) {}

// ngOnInit() {
//   this.productsService.getProducts().subscribe((response) => {
//     this.products = response.items;
//   });
// }
