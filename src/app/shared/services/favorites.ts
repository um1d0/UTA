import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private http = inject(HttpClient);
  private apiUrl = 'https://shopapi.stepacademy.ge/api/favorites';

  getFavorites(page: number = 1, take: number = 12) {
    return this.http.get(`${this.apiUrl}?Page=${page}&Take=${take}`);
  }

  addFavorite(productId: number) {
    return this.http.post(`${this.apiUrl}/${productId}`, {});
  }

  removeFavorite(productId: number) {
    return this.http.delete(`${this.apiUrl}/${productId}`);
  }
}
