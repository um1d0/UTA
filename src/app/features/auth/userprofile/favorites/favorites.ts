import { CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favorites',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = 'https://shopapi.stepacademy.ge/api/favorites';

  favorites: any[] = [];
  errorMessage = '';

  ngOnInit() {
    this.getFavorites();
  }

  getFavorites() {
    this.errorMessage = '';

    this.http.get(this.apiUrl).subscribe({
      next: (response: any) => {
        console.log('Favorites response:', response);
        this.favorites = this.normalizeFavorites(response);
      },
      error: (error) => {
        console.error('Could not load favorites:', error);
        this.errorMessage = error?.error?.message ?? 'Could not load favorites.';
      },
    });
  }

  removeFavorite(productId: number) {
    this.http.delete(`${this.apiUrl}/${productId}`).subscribe({
      next: () => {
        this.favorites = this.favorites.filter((item) => this.getProductId(item) !== productId);
      },
      error: (error) => {
        console.error('Could not remove favorite:', error);
        alert(error?.error?.message ?? 'Could not remove favorite.');
      },
    });
  }

  normalizeFavorites(response: any): any[] {
    const data = response?.data ?? response;
    const items =
      data?.items ??
      data?.favorites ??
      data?.favoriteProducts ??
      data?.products ??
      this.findArray(data);

    return Array.isArray(items) ? items : [];
  }

  findArray(value: any): any[] | undefined {
    if (Array.isArray(value)) {
      return value;
    }

    if (!value || typeof value !== 'object') {
      return undefined;
    }

    for (const key of Object.keys(value)) {
      const result = this.findArray(value[key]);

      if (result) {
        return result;
      }
    }

    return undefined;
  }

  getProduct(item: any) {
    return item?.product ?? item?.Product ?? item?.productDto ?? item?.productDTO ?? item;
  }

  getProductId(item: any) {
    const product = this.getProduct(item);
    return item?.productId ?? item?.ProductId ?? product?.id ?? product?.productId ?? item?.id;
  }

  getProductName(item: any) {
    const product = this.getProduct(item);
    return item?.name ?? item?.productName ?? product?.name ?? 'Product';
  }

  getProductImage(item: any) {
    const product = this.getProduct(item);
    return item?.imageUrl ?? item?.productImageUrl ?? product?.imageUrl ?? '';
  }

  getProductPrice(item: any) {
    const product = this.getProduct(item);
    return Number(item?.price ?? item?.productPrice ?? product?.price ?? 0);
  }
}
