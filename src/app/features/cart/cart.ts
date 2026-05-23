import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../shared/services/cart';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  private cartService = inject(CartService);

  cartItems: any[] = [];
  total = 0;

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (response: any) => {
        this.cartItems = response?.data?.items ?? response?.data ?? response?.items ?? response ?? [];
        this.calculateTotal();
      },
      error: (error) => {
        console.error('Could not load cart:', error);
      },
    });
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((sum, item) => {
      const price = item.price ?? item.product?.price ?? 0;
      const quantity = item.quantity ?? 1;

      return sum + price * quantity;
    }, 0);
  }

  increase(item: any) {
    item.quantity += 1;
    this.calculateTotal();
  }

  decrease(item: any) {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.calculateTotal();
    }
  }

  remove(productId: string) {
    this.cartItems = this.cartItems.filter((item) => item.productId !== productId);
    this.calculateTotal();
  }
}
