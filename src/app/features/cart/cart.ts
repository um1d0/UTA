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
      next: (data: any) => {
        this.cartItems = data.items ?? data;
        this.calculateTotal();
      },
      error: (err) => console.error(err)
    });
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  increase(item: any) {
    this.cartService.editQuantity(item.productId, item.quantity + 1).subscribe(() => this.loadCart());
  }

  decrease(item: any) {
    if (item.quantity > 1) {
      this.cartService.editQuantity(item.productId, item.quantity - 1).subscribe(() => this.loadCart());
    }
  }

  remove(productId: string) {
    this.cartService.removeFromCart(productId).subscribe(() => this.loadCart());
  }
}