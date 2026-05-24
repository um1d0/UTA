import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ProductDetails } from './product-details';
import { FavoritesService } from '../../shared/services/favorites';
import { ReviewsService } from '../../shared/services/reviews';

describe('ProductDetails', () => {
  let component: ProductDetails;
  let fixture: ComponentFixture<ProductDetails>;
  const favoritesService = {
    addFavorite: vi.fn(() => of({})),
    removeFavorite: vi.fn(() => of({})),
  };
  const reviewsService = {
    getReviews: vi.fn(() =>
      of({
        items: [{ id: 2, rating: 4, createdAt: '2026-01-01T00:00:00', user: { id: 10 } }],
        totalCount: 1,
      }),
    ),
    createReview: vi.fn(() => of({})),
    updateReview: vi.fn(() => of({})),
    deleteReview: vi.fn(() => of({})),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [ProductDetails],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '1' })),
          },
        },
        {
          provide: HttpClient,
          useValue: {
            get: vi.fn(() =>
              of({
                data: {
                  id: 1,
                  name: 'Phone',
                  brand: 'Brand',
                  model: 'Model',
                  price: 100,
                  rating: 4,
                  stock: 3,
                  imageUrl: 'main.jpg',
                  imageUrls: ['second.jpg'],
                  isFavorite: false,
                  category: { name: 'Phones' },
                  specifications: {},
                },
              }),
            ),
          },
        },
        {
          provide: FavoritesService,
          useValue: favoritesService,
        },
        {
          provide: ReviewsService,
          useValue: reviewsService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select the first product image', () => {
    expect(component.selectedImage()).toBe('main.jpg');
  });

  it('should load product reviews', () => {
    expect(reviewsService.getReviews).toHaveBeenCalledWith(1, 1, 5);
    expect(component.reviews().length).toBe(1);
  });

  it('should add product to favorites when product is not favorite', () => {
    localStorage.setItem('access_token', 'token');

    component.toggleFavorite();

    expect(favoritesService.addFavorite).toHaveBeenCalledWith(1);
    expect(component.product().isFavorite).toBe(true);
  });

  it('should create a rating review', () => {
    localStorage.setItem('access_token', 'token');
    component.reviewRate.set(5);

    component.submitReview();

    expect(reviewsService.createReview).toHaveBeenCalledWith(1, 5);
  });

  it('should update the current user review when it already exists', () => {
    localStorage.setItem('access_token', 'token');
    component.currentUser.set({ id: 10 });
    component.reviewRate.set(3);

    component.submitReview();

    expect(reviewsService.updateReview).toHaveBeenCalledWith(2, 3);
    expect(reviewsService.createReview).not.toHaveBeenCalled();
  });

  it('should find current user review when API returns id values with different types', () => {
    component.currentUser.set({ id: '10' });

    expect(component.currentUserReview()?.id).toBe(2);
  });

  it('should remove the current user review', () => {
    localStorage.setItem('access_token', 'token');
    component.currentUser.set({ id: 10 });

    component.deleteReview();

    expect(reviewsService.deleteReview).toHaveBeenCalledWith(2);
    expect(component.currentUserReview()).toBeNull();
  });

  it('should render reviews below the main details layout', () => {
    const layout: HTMLElement = fixture.nativeElement.querySelector('.details-layout');
    const reviews: HTMLElement = fixture.nativeElement.querySelector('.reviews');

    expect(layout.contains(reviews)).toBe(false);
  });
});
