import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../shared/services/cart';
import { catchError, forkJoin, Observable, Subscription, throwError } from 'rxjs';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit, OnDestroy {
  private cartService = inject(CartService);
  private cartSubscription?: Subscription;

  cartItems = signal<any[]>([]);
  checkoutOpen = signal(false);
  orderPlaced = signal(false);
  checkoutData = {
    address: '',
    city: '',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  };
  total = computed(() =>
    this.cartItems().reduce((sum, item) => {
      const price = item.price ?? item.product?.price ?? 0;
      const quantity = item.quantity ?? 1;

      return sum + (item.totalPrice ?? price * quantity);
    }, 0),
  );

  ngOnInit() {
    this.loadCart();
    this.cartSubscription = this.cartService.cartChanged$.subscribe(() => {
      this.loadCart();
    });
  }

  ngOnDestroy() {
    this.cartSubscription?.unsubscribe();
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (response: any) => {
        this.cartItems.set(this.getCartItems(response));
      },
      error: (error) => {
        console.error('Could not load cart:', error);
      },
    });
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

  increase(item: any) {
    this.changeQuantity(item, item.quantity + 1);
  }

  decrease(item: any) {
    if (item.quantity > 1) {
      this.changeQuantity(item, item.quantity - 1);
    }
  }

  private changeQuantity(item: any, quantity: number) {
    this.cartService.editQuantity(item.id, quantity).subscribe({
      next: () => {
        this.cartItems.update((items) =>
          items.map((cartItem) => {
            if (cartItem.id !== item.id) {
              return cartItem;
            }

            return {
              ...cartItem,
              quantity,
              totalPrice: (cartItem.price ?? cartItem.product?.price ?? 0) * quantity,
            };
          }),
        );
      },
      error: (error) => {
        console.error('Could not update cart quantity:', error);
      },
    });
  }

  remove(item: any) {
    this.removeItemFromServer(item).subscribe({
      next: () => {
        this.cartItems.update((items) => items.filter((cartItem) => cartItem.id !== item.id));
      },
      error: (error) => {
        console.error('Could not remove cart item:', error);
      },
    });
  }

  deleteAll() {
    const items = this.cartItems();

    if (items.length === 0) {
      return;
    }

    forkJoin(items.map((item) => this.removeItemFromServer(item))).subscribe({
      next: () => {
        this.cartItems.set([]);
      },
      error: (error) => {
        console.error('Could not delete cart items:', error);
      },
    });
  }

  openCheckout() {
    this.checkoutOpen.set(true);
    this.orderPlaced.set(false);
  }

  submitCheckout() {
    this.cartService.checkout().subscribe({
      next: () => {
        this.cartItems.set([]);
        this.checkoutOpen.set(false);
        this.orderPlaced.set(true);
        this.checkoutData = {
          address: '',
          city: '',
          cardName: '',
          cardNumber: '',
          expiry: '',
          cvv: '',
        };
      },
      error: (error) => {
        console.error('Could not checkout:', error);
      },
    });
  }

  private removeItemFromServer(item: any): Observable<unknown> {
    const productId = item.product?.id ?? item.productId;
    const itemId = item.id;
    const firstId = productId ?? itemId;

    return this.cartService.removeFromCart(firstId).pipe(
      catchError((error) => {
        if (productId && itemId && productId !== itemId) {
          return this.cartService.removeFromCart(itemId);
        }

        return throwError(() => error);
      }),
    );
  }
}
