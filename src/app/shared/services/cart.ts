import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CartService {
  private baseUrl = 'https://shopapi.stepacademy.ge/api/cart';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  getCart() {
    return this.http.get(this.baseUrl, { headers: this.getHeaders() });
  }

  addToCart(productId: string, quantity: number) {
    return this.http.post(`${this.baseUrl}/add-to-cart`, { productId, quantity }, { headers: this.getHeaders() });
  }

  removeFromCart(productId: string) {
    return this.http.delete(`${this.baseUrl}/remove-from-cart/${productId}`, { headers: this.getHeaders() });
  }

  editQuantity(productId: string, quantity: number) {
    return this.http.put(`${this.baseUrl}/edit-quantity`, { productId, quantity }, { headers: this.getHeaders() });
  }
}