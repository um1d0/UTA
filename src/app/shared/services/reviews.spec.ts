import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ReviewsService } from './reviews';

describe('ReviewsService', () => {
  const httpClient = {
    get: vi.fn(() => of({})),
    post: vi.fn(() => of({})),
    put: vi.fn(() => of({})),
    delete: vi.fn(() => of({})),
  };

  let service: ReviewsService;

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        ReviewsService,
        {
          provide: HttpClient,
          useValue: httpClient,
        },
      ],
    });

    service = TestBed.inject(ReviewsService);
  });

  it('should load product reviews', () => {
    service.getReviews(9, 1, 5).subscribe();

    expect(httpClient.get).toHaveBeenCalledWith(
      'https://shopapi.stepacademy.ge/api/reviews/9?Page=1&Take=5',
    );
  });

  it('should create a review rating', () => {
    service.createReview(9, 4).subscribe();

    expect(httpClient.post).toHaveBeenCalledWith('https://shopapi.stepacademy.ge/api/reviews', {
      productId: 9,
      rate: 4,
    });
  });

  it('should update a review rating', () => {
    service.updateReview(3, 5).subscribe();

    expect(httpClient.put).toHaveBeenCalledWith('https://shopapi.stepacademy.ge/api/reviews', {
      reviewId: 3,
      rate: 5,
    });
  });

  it('should delete the current user review for a product', () => {
    service.deleteReview(9).subscribe();

    expect(httpClient.delete).toHaveBeenCalledWith('https://shopapi.stepacademy.ge/api/reviews/9');
  });
});
