import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Subject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = 'https://shopapi.stepacademy.ge/api/cart';
  private usersUrl = 'https://shopapi.stepacademy.ge/api/users';

  cartChanged$ = new Subject<void>();
  cartCount = signal(0);

  addToCart(productId: number, quantity: number = 1) {
    return this.http.post(`${this.apiUrl}/add-to-cart`, { productId, quantity }).pipe(
      tap(() => {
        this.cartChanged$.next();
        this.refreshCartCount().subscribe();
      }),
    );
  }

  getCart() {
    return this.http.get(this.apiUrl);
  }

  refreshCartCount() {
    return this.getCart().pipe(
      tap((response: any) => {
        this.cartCount.set(this.countItems(response));
      }),
    );
  }

  removeFromCart(productId: number) {
    return this.http
      .delete(`${this.apiUrl}/remove-from-cart/${productId}`)
      .pipe(tap(() => this.refreshCartCount().subscribe()));
  }

  editQuantity(itemId: number, quantity: number) {
    return this.http
      .put(`${this.apiUrl}/edit-quantity`, { itemId, quantity })
      .pipe(tap(() => this.refreshCartCount().subscribe()));
  }

  checkout() {
    return this.http.post(`${this.usersUrl}/checkout`, {}).pipe(tap(() => this.cartCount.set(0)));
  }

  private countItems(response: any): number {
    const items = this.getCartItems(response);

    return items.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
  }

  private getCartItems(response: any): any[] {
    if (Array.isArray(response?.items)) {
      return response.items;
    }

    if (Array.isArray(response?.data?.items)) {
      return response.data.items;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response)) {
      return response;
    }

    return [];
  }
}
