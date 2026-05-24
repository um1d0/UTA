import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../shared/services/cart';
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  private http = inject(HttpClient);
  private cartService = inject(CartService);

  cartCount = this.cartService.cartCount;
  Isopen = signal(false);
  private router = inject(Router);
  ngOnInit() {
    this.getCategories();
    if (this.isLoggedIn()) {
      this.cartService.refreshCartCount().subscribe();
    }
  }
  open() {
    this.Isopen.update((x) => !x);
  }

  closeMenu() {
    this.Isopen.set(false);
  }

  isLoggedIn() {
    return !!localStorage.getItem('access_token');
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.cartService.cartCount.set(0);
    this.router.navigateByUrl('/login');
  }
  Search(something: any) {
    if (!something) return;
    this.closeMenu();
    this.router.navigate(['/allproducts'], { queryParams: { search: something } });
  }
  getCategory(categoryID: any) {
    if (!categoryID) return;
    this.closeMenu();
    this.router.navigate(['/allproducts'], { queryParams: { categoryid: categoryID } });
  }

  openCart() {
    this.closeMenu();
    if (this.router.url.startsWith('/cart')) {
      this.cartService.cartChanged$.next();
      return;
    }

    this.router.navigate(['/cart']);
  }

  Category = signal<any>(null);

  getCategories() {
    this.http.get('https://shopapi.stepacademy.ge/api/categories').subscribe({
      next: (data: any) => {
        this.Category.set(data.data);
        console.log(this.Category());
      },
      error: (error) => {
        console.log(error, this.Category());
      },
    });
  }

  logo = 'assets/images/logo.png';
}
