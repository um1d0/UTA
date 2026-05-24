import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../../shared/services/cart';
import { FavoritesService } from '../../shared/services/favorites';
import { ReviewsService } from '../../shared/services/reviews';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cartService = inject(CartService);
  private favoritesService = inject(FavoritesService);
  private reviewsService = inject(ReviewsService);

  product = signal<any>(null);
  selectedImage = signal('');
  reviews = signal<any[]>([]);
  reviewRate = signal(5);
  reviewMessage = signal('');
  ratingOptions = [1, 2, 3, 4, 5];
  currentUser = signal<any>(null);
  currentUserReview = computed(() => {
    const user = this.currentUser();

    if (!user) return null;

    return (
      this.reviews().find((review) => {
        const reviewUser = review?.user;

        if (reviewUser?.id && user?.id) {
          return String(reviewUser.id) === String(user.id);
        }

        if (reviewUser?.email && user?.email) {
          return reviewUser.email === user.email;
        }

        return false;
      }) ?? null
    );
  });

  ngOnInit() {
    if (this.isLoggedIn()) {
      this.loadCurrentUser();
    }

    this.route.paramMap.subscribe((params) => {
      const productId = Number(params.get('id'));

      if (productId) {
        this.loadProduct(productId);
      }
    });
  }

  loadProduct(productId: number) {
    this.http.get(`https://shopapi.stepacademy.ge/api/products/${productId}`).subscribe({
      next: (response: any) => {
        const product = response?.data ?? response;
        this.product.set(product);
        this.selectedImage.set(this.getImages(product)[0] ?? '');
        this.loadReviews(product.id);
      },
      error: (error) => {
        console.error('Could not load product:', error);
      },
    });
  }

  loadCurrentUser() {
    this.http.get('https://shopapi.stepacademy.ge/api/users/me').subscribe({
      next: (response: any) => {
        this.currentUser.set(response?.data ?? response);
        this.syncCurrentUserReviewRate();
      },
      error: (error) => {
        console.error('Could not load current user:', error);
      },
    });
  }

  loadReviews(productId: number) {
    this.reviewsService.getReviews(productId, 1, 5).subscribe({
      next: (response: any) => {
        const reviews = response?.items ?? response?.data?.items ?? response?.data ?? [];
        this.reviews.set(reviews);
        this.syncCurrentUserReviewRate();
      },
      error: (error) => {
        console.error('Could not load reviews:', error);
      },
    });
  }

  getImages(product: any): string[] {
    const images = product?.imageUrls?.length ? product.imageUrls : [];

    if (product?.imageUrl && !images.includes(product.imageUrl)) {
      return [product.imageUrl, ...images];
    }

    return images;
  }

  addToCart(productId: number) {
    const token = localStorage.getItem('access_token');

    if (!token) {
      alert('You have to login first!');
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.addToCart(productId).subscribe({
      next: () => {
        alert('Product added to cart!');
      },
      error: (error) => {
        console.error('Could not add product to cart:', error);
        alert(error?.error?.message ?? 'Could not add product to cart.');
      },
    });
  }

  toggleFavorite() {
    const product = this.product();

    if (!product) return;

    if (!this.isLoggedIn()) {
      alert('You have to login first!');
      this.router.navigate(['/login']);
      return;
    }

    const request = product.isFavorite
      ? this.favoritesService.removeFavorite(product.id)
      : this.favoritesService.addFavorite(product.id);

    request.subscribe({
      next: () => {
        this.product.set({ ...product, isFavorite: !product.isFavorite });
      },
      error: (error) => {
        console.error('Could not update favorite:', error);
        alert(error?.error?.message ?? 'Could not update favorite.');
      },
    });
  }

  submitReview() {
    const product = this.product();

    if (!product) return;

    if (!this.isLoggedIn()) {
      alert('You have to login first!');
      this.router.navigate(['/login']);
      return;
    }

    const existingReview = this.currentUserReview();
    const request = existingReview
      ? this.reviewsService.updateReview(existingReview.id, this.reviewRate())
      : this.reviewsService.createReview(product.id, this.reviewRate());

    request.subscribe({
      next: () => {
        this.reviewMessage.set(existingReview ? 'Rating updated.' : 'Rating saved.');
        this.loadProduct(product.id);
      },
      error: (error) => {
        console.error('Could not save review:', error);
        this.reviewMessage.set(error?.error?.message ?? 'Could not save rating.');
      },
    });
  }

  deleteReview() {
    const product = this.product();

    if (!product) return;

    if (!this.isLoggedIn()) {
      alert('You have to login first!');
      this.router.navigate(['/login']);
      return;
    }

    const existingReview = this.currentUserReview();

    if (!existingReview) {
      this.reviewMessage.set('You have no rating to delete.');
      return;
    }

    this.reviewsService.deleteReview(existingReview.id).subscribe({
      next: () => {
        this.reviews.update((reviews) =>
          reviews.filter((review) => String(review.id) !== String(existingReview.id)),
        );
        this.reviewRate.set(5);
        this.reviewMessage.set('Rating removed.');
      },
      error: (error) => {
        console.error('Could not delete review:', error);
        this.reviewMessage.set(error?.error?.message ?? 'Could not remove rating.');
      },
    });
  }

  private isLoggedIn() {
    return !!localStorage.getItem('access_token');
  }

  private syncCurrentUserReviewRate() {
    const review = this.currentUserReview();

    if (review?.rating) {
      this.reviewRate.set(review.rating);
    }
  }
}
