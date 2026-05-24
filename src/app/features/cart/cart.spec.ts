import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';

import { Cart } from './cart';
import { CartService } from '../../shared/services/cart';

describe('Cart', () => {
  let component: Cart;
  let fixture: ComponentFixture<Cart>;
  let cartService: {
    getCart: ReturnType<typeof vi.fn>;
    removeFromCart: ReturnType<typeof vi.fn>;
    editQuantity: ReturnType<typeof vi.fn>;
    checkout: ReturnType<typeof vi.fn>;
    cartChanged$: {
      subscribe: ReturnType<typeof vi.fn>;
    };
  };

  beforeEach(async () => {
    cartService = {
      getCart: vi.fn(() =>
        of({
          items: [
            {
              id: 1,
              quantity: 2,
              price: 100,
              totalPrice: 200,
              product: {
                id: 10,
                name: 'Phone',
                imageUrl: 'phone.jpg',
              },
            },
          ],
        }),
      ),
      removeFromCart: vi.fn(() => of(null)),
      editQuantity: vi.fn(() => of(null)),
      checkout: vi.fn(() => of(null)),
      cartChanged$: {
        subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })),
      },
    };

    await TestBed.configureTestingModule({
      imports: [Cart],
      providers: [provideRouter([]), { provide: CartService, useValue: cartService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Cart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('removes the product from the backend cart before updating the page', () => {
    component.remove(component.cartItems()[0]);

    expect(cartService.removeFromCart).toHaveBeenCalledWith(10);
    expect(component.cartItems()).toEqual([]);
  });

  it('tries the cart item id if removing by product id fails', () => {
    cartService.removeFromCart
      .mockReturnValueOnce(throwError(() => new Error('wrong id')))
      .mockReturnValueOnce(of(null));

    component.remove(component.cartItems()[0]);

    expect(cartService.removeFromCart).toHaveBeenNthCalledWith(1, 10);
    expect(cartService.removeFromCart).toHaveBeenNthCalledWith(2, 1);
    expect(component.cartItems()).toEqual([]);
  });

  it('loads cart items when the API wraps them in data', () => {
    cartService.getCart.mockReturnValueOnce(
      of({
        data: [
          {
            id: 2,
            quantity: 1,
            price: 50,
            product: {
              id: 20,
              name: 'Laptop',
              imageUrl: 'laptop.jpg',
            },
          },
        ],
      }),
    );

    component.loadCart();

    expect(component.cartItems()[0].product.name).toBe('Laptop');
  });

  it('updates quantity through the backend cart API', () => {
    const item = component.cartItems()[0];

    component.increase(item);

    expect(cartService.editQuantity).toHaveBeenCalledWith(1, 3);
    expect(component.cartItems()[0].quantity).toBe(3);
    expect(component.total()).toBe(300);
  });

  it('checks out through the backend API and clears the cart', () => {
    component.submitCheckout();

    expect(cartService.checkout).toHaveBeenCalled();
    expect(component.cartItems()).toEqual([]);
  });

  it('deletes all cart items through the backend API', () => {
    component.deleteAll();

    expect(cartService.removeFromCart).toHaveBeenCalledWith(10);
    expect(component.cartItems()).toEqual([]);
  });
});
