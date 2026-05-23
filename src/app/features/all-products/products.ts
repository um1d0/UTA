import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../shared/services/cart';

export class ProductsComponent {
  private cartService = inject(CartService);
  private router = inject(Router);

  addToCart(productId: number): void {
    const token = localStorage.getItem('access_token');

    if (!token) {
      alert('გთხოვთ პირველად დალოგინდეთ!');
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.addToCart(productId).subscribe({
      next: (res) => {
        console.log('Cart-ში დაემატა!', res);
      },
      error: (err) => {
        console.error('შეცდომა:', err);
      }
    });
  }
}