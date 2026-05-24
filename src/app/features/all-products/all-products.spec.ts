import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { AllProducts } from './all-products';
import { FavoritesService } from '../../shared/services/favorites';

describe('AllProducts', () => {
  let component: AllProducts;
  let fixture: ComponentFixture<AllProducts>;
  const favoritesService = {
    addFavorite: vi.fn(() => of({})),
    removeFavorite: vi.fn(() => of({})),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [AllProducts],
      providers: [
        provideRouter([]),
        {
          provide: HttpClient,
          useValue: {
            get: vi.fn((url: string) => {
              if (url.includes('/categories')) {
                return of({ data: [] });
              }

              return of({
                data: {
                  items: [],
                  totalCount: 0,
                  totalPages: 0,
                },
              });
            }),
          },
        },
        {
          provide: FavoritesService,
          useValue: favoritesService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AllProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a product to favorites from the product card', () => {
    localStorage.setItem('access_token', 'token');
    const product = { id: 4, isFavorite: false };

    component.toggleFavorite(product);

    expect(favoritesService.addFavorite).toHaveBeenCalledWith(4);
    expect(product.isFavorite).toBe(true);
  });
});
