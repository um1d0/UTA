import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { FavoritesService } from './favorites';

describe('FavoritesService', () => {
  const httpClient = {
    get: vi.fn(() => of({})),
    post: vi.fn(() => of({})),
    delete: vi.fn(() => of({})),
  };

  let service: FavoritesService;

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        FavoritesService,
        {
          provide: HttpClient,
          useValue: httpClient,
        },
      ],
    });

    service = TestBed.inject(FavoritesService);
  });

  it('should load paged favorites', () => {
    service.getFavorites(2, 8).subscribe();

    expect(httpClient.get).toHaveBeenCalledWith(
      'https://shopapi.stepacademy.ge/api/favorites?Page=2&Take=8',
    );
  });

  it('should add a product to favorites', () => {
    service.addFavorite(7).subscribe();

    expect(httpClient.post).toHaveBeenCalledWith(
      'https://shopapi.stepacademy.ge/api/favorites/7',
      {},
    );
  });

  it('should remove a product from favorites', () => {
    service.removeFavorite(7).subscribe();

    expect(httpClient.delete).toHaveBeenCalledWith(
      'https://shopapi.stepacademy.ge/api/favorites/7',
    );
  });
});
