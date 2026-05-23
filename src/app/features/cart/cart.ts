import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../shared/services/cart';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  private cartService = inject(CartService);
  private router = inject(Router);

  cartItems: any[] = [];
  total = 0;
  cartError = '';

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    if (!localStorage.getItem('access_token')) {
      this.router.navigate(['/login']);
      return;
    }

    this.cartError = '';

    this.cartService.getCart().subscribe({
      next: (response: any) => {
        console.log('Cart response:', response);
        this.cartItems = this.normalizeCartItems(response);
        this.calculateTotal();
      },
      error: (error) => {
        console.error('Could not load cart:', error);
        if (error.status === 401) {
          alert('Your login expired. Please log in again.');
          this.router.navigate(['/login']);
          return;
        }

        this.cartError = error?.error?.message ?? 'Could not load cart.';
      },
    });
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((sum, item) => {
      const price = this.getItemPrice(item);
      const quantity = this.getItemQuantity(item);

      return sum + price * quantity;
    }, 0);
  }

  normalizeCartItems(response: any): any[] {
    const cart = response?.data ?? response;
    const items =
      cart?.items ??
      cart?.cartItems ??
      cart?.products ??
      cart?.cartProducts ??
      cart?.cart?.items ??
      cart?.cart?.cartItems ??
      cart?.cart?.products ??
      cart?.cart?.cartProducts ??
      this.findProductArray(cart);

    return Array.isArray(items) ? items : [];
  }

  findProductArray(value: any): any[] | undefined {
    if (Array.isArray(value)) {
      return value.some((item) => this.looksLikeCartItem(item)) ? value : undefined;
    }

    if (!value || typeof value !== 'object') {
      return undefined;
    }

    for (const key of Object.keys(value)) {
      const result = this.findProductArray(value[key]);

      if (result) {
        return result;
      }
    }

    return undefined;
  }

  looksLikeCartItem(item: any) {
    return !!(
      item?.product ||
      item?.Product ||
      item?.productId ||
      item?.name ||
      item?.imageUrl ||
      item?.price ||
      item?.quantity
    );
  }

  getProduct(item: any) {
    return item?.product ?? item?.Product ?? item?.productDto ?? item?.productDTO ?? item;
  }

  getItemId(item: any) {
    const product = this.getProduct(item);
    return item?.productId ?? item?.id ?? product?.id;
  }

  getItemName(item: any) {
    const product = this.getProduct(item);
    return item?.name ?? item?.productName ?? product?.name ?? 'Product';
  }

  getItemImage(item: any) {
    const product = this.getProduct(item);
    return item?.imageUrl ?? item?.productImageUrl ?? product?.imageUrl ?? '';
  }

  getItemPrice(item: any) {
    const product = this.getProduct(item);
    return Number(item?.price ?? item?.productPrice ?? product?.price ?? 0);
  }

  getItemQuantity(item: any) {
    return Number(item?.quantity ?? item?.count ?? 1);
  }

  increase(item: any) {
    item.quantity = this.getItemQuantity(item) + 1;
    this.calculateTotal();
  }

  decrease(item: any) {
    const quantity = this.getItemQuantity(item);

    if (quantity > 1) {
      item.quantity = quantity - 1;
      this.calculateTotal();
    }
  }

  remove(productId: string | number) {
    this.cartItems = this.cartItems.filter((item) => this.getItemId(item) !== productId);
    this.calculateTotal();
  }
}
