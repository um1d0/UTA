import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { Favorites } from './favorites';
import { CartService } from '../../shared/services/cart';
import { FavoritesService } from '../../shared/services/favorites';

describe('Favorites', () => {
  let component: Favorites;
  let fixture: ComponentFixture<Favorites>;
  const favoritesService = {
    getFavorites: vi.fn(() =>
      of({
        items: [{ id: 1, name: 'Phone', price: 100, imageUrl: 'phone.jpg', stock: 2 }],
        totalPages: 1,
      }),
    ),
    removeFavorite: vi.fn(() => of({})),
  };
  const cartService = {
    addToCart: vi.fn(() => of({})),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [Favorites],
      providers: [
        provideRouter([]),
        {
          provide: FavoritesService,
          useValue: favoritesService,
        },
        {
          provide: CartService,
          useValue: cartService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Favorites);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should load favorite products', () => {
    expect(favoritesService.getFavorites).toHaveBeenCalledWith(1, 12);
    expect(component.products().length).toBe(1);
  });

  it('should remove a favorite product', () => {
    component.removeFavorite(1);

    expect(favoritesService.removeFavorite).toHaveBeenCalledWith(1);
    expect(component.products().length).toBe(0);
  });
});
