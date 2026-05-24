import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  private http = inject(HttpClient);
  private apiUrl = 'https://shopapi.stepacademy.ge/api/reviews';

  getReviews(productId: number, page: number = 1, take: number = 5) {
    return this.http.get(`${this.apiUrl}/${productId}?Page=${page}&Take=${take}`);
  }

  createReview(productId: number, rate: number) {
    return this.http.post(this.apiUrl, { productId, rate });
  }

  updateReview(reviewId: number, rate: number) {
    return this.http.put(this.apiUrl, { reviewId, rate });
  }

  deleteReview(productId: number) {
    return this.http.delete(`${this.apiUrl}/${productId}`);
  }
}
