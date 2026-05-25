import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { PipeNamePipe } from '../../../pipe-name-pipe';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../shared/services/cart';
import { Router, RouterLink } from '@angular/router';
import { FavoritesService } from '../../../shared/services/favorites';

@Component({
  selector: 'app-featured-products',
  imports: [PipeNamePipe, RouterLink],
  templateUrl: './featured-products.html',
  styleUrl: './featured-products.css',
})
export class FeaturedProducts implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private cartService = inject(CartService);
  private favoritesService = inject(FavoritesService);
  private cdr = inject(ChangeDetectorRef);

  featuredProducts = signal<any[]>([]);
  newArrivals = signal<any[]>([]);
  featuredLoading = signal(true);
  arrivalsLoading = signal(true);
  accessoriesCategoryId = signal<number | undefined>(undefined);

  skeletons = Array(4).fill(0);

  ngOnInit() {
    this.loadFeaturedProducts();
    this.loadNewArrivals();
    this.loadAccessoriesCategory();
  }

  loadFeaturedProducts() {
    this.featuredLoading.set(true);
    this.http
      .get<any>(
        'https://shopapi.stepacademy.ge/api/products/filter?Page=1&Take=8&SortBy=rating&SortDescending=true',
      )
      .subscribe({
        next: (res) => {
          this.featuredProducts.set(res?.data?.items ?? []);
          this.featuredLoading.set(false);
        },
        error: () => this.featuredLoading.set(false),
      });
  }

  loadNewArrivals() {
    this.arrivalsLoading.set(true);
    this.http
      .get<any>(
        'https://shopapi.stepacademy.ge/api/products/filter?Page=1&Take=8&SortBy=Newest&SortDescending=true',
      )
      .subscribe({
        next: (res) => {
          this.newArrivals.set(res?.data?.items ?? []);
          this.arrivalsLoading.set(false);
        },
        error: () => this.arrivalsLoading.set(false),
      });
  }

  loadAccessoriesCategory() {
    this.http.get<any>('https://shopapi.stepacademy.ge/api/categories').subscribe({
      next: (res) => {
        const cats: any[] = res?.data ?? [];
        const acc = cats.find(
          (c) =>
            c.name?.toLowerCase().includes('accessor') ||
            c.name?.toLowerCase().includes('cable') ||
            c.name?.toLowerCase().includes('periph'),
        );
        if (acc) this.accessoriesCategoryId.set(acc.id);
      },
    });
  }

  addToCart(productId: number): void {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('You have to login first!');
      this.router.navigate(['/login']);
      return;
    }
    this.cartService.addToCart(productId).subscribe({
      next: () => alert('Product added to cart!'),
      error: (err) => alert(err?.error?.message ?? 'Could not add product to cart.'),
    });
  }

  toggleFavorite(product: any): void {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('You have to login first!');
      this.router.navigate(['/login']);
      return;
    }
    const request = product.isFavorite
      ? this.favoritesService.removeFavorite(product.id)
      : this.favoritesService.addFavorite(product.id);

    request.subscribe({
      next: () => {
        product.isFavorite = !product.isFavorite;
        this.cdr.markForCheck();
      },
      error: (err) => alert(err?.error?.message ?? 'Could not update favorite.'),
    });
  }
}
