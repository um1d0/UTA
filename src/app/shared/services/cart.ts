import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = 'https://shopapi.stepacademy.ge/api/cart';

  addToCart(productId: number, quantity: number = 1) {
    const params = new HttpParams()
      .set('productId', productId)
      .set('quantity', quantity);

    return this.http.post(`${this.apiUrl}/add-to-cart`, { productId, quantity }, { params });
  }

  getCart() {
    return this.http.get(this.apiUrl);
  }
}
