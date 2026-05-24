import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../shared/services/cart';
import { FavoritesService } from '../../shared/services/favorites';

@Component({
  selector: 'app-favorites',
  imports: [RouterLink],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites implements OnInit {
  private favoritesService = inject(FavoritesService);
  private cartService = inject(CartService);

  products = signal<any[]>([]);
  message = signal('');
  page = 1;
  take = 12;

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favoritesService.getFavorites(this.page, this.take).subscribe({
      next: (response: any) => {
        const products = response?.items ?? response?.data?.items ?? response?.data ?? [];
        this.products.set(products);
      },
      error: (error) => {
        console.error('Could not load favorites:', error);
        this.message.set(error?.error?.message ?? 'Could not load favorites.');
      },
    });
  }

  removeFavorite(productId: number): void {
    this.favoritesService.removeFavorite(productId).subscribe({
      next: () => {
        this.products.update((products) => products.filter((product) => product.id !== productId));
      },
      error: (error) => {
        console.error('Could not remove favorite:', error);
        this.message.set(error?.error?.message ?? 'Could not remove favorite.');
      },
    });
  }

  addToCart(productId: number): void {
    this.cartService.addToCart(productId).subscribe({
      next: () => {
        this.message.set('Product added to cart.');
      },
      error: (error) => {
        console.error('Could not add favorite to cart:', error);
        this.message.set(error?.error?.message ?? 'Could not add product to cart.');
      },
    });
  }
}
