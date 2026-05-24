import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Category {
  id: number;
  name: string;
  image?: string;
  image_url?: string;
  photo?: string;
  thumbnail?: string;
  products_count?: number;
  count?: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  rating?: number;
  average_rating?: number;
  image?: string;
  image_url?: string;
  photo?: string;
  thumbnail?: string;
  category?: string;
  category_name?: string;
}

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './featured-products.html',
  styleUrl: './featured-products.css'
})
export class FeaturedProductsComponent implements OnInit {
  private http = inject(HttpClient);

  products: Product[] = [];
  loading = true;
  error = '';
  starsArray = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    // ჯერ categories ვცდი, შემდეგ products
    this.http.get<any>('https://shopapi.stepacademy.ge/api/products').subscribe({
      next: (data) => {
        this.handleData(data);
      },
      error: () => {
        // თუ /products არ არის, /categories ვცდი
        this.http.get<any>('https://shopapi.stepacademy.ge/api/categories').subscribe({
          next: (data) => {
            this.handleData(data);
          },
          error: (err) => {
            this.error = 'პროდუქტები ვერ ჩაიტვირთა.';
            this.loading = false;
            console.error('API Error:', err);
          }
        });
      }
    });
  }

  private handleData(data: any): void {
    console.log('API Response:', data); // Console-ში ნახავ სტრუქტურას

    let items: any[] = [];

    if (Array.isArray(data)) {
      items = data;
    } else if (data?.results && Array.isArray(data.results)) {
      items = data.results;
    } else if (data?.data && Array.isArray(data.data)) {
      items = data.data;
    } else if (data?.products && Array.isArray(data.products)) {
      items = data.products;
    } else if (data?.categories && Array.isArray(data.categories)) {
      items = data.categories;
    } else if (data?.items && Array.isArray(data.items)) {
      items = data.items;
    } else {
      // object-ის values ვცადოთ
      const values = Object.values(data);
      const arr = values.find(v => Array.isArray(v));
      if (arr) items = arr as any[];
    }

    this.products = items.slice(0, 8).map(item => ({
      id: item.id,
      name: item.name || item.title || item.category_name || 'Product',
      price: item.price || item.cost || 0,
      rating: item.rating || item.average_rating || item.rate || 0,
      image: item.image || item.image_url || item.photo || item.thumbnail || item.img || '',
      category: item.category || item.category_name || item.type || ''
    }));

    this.loading = false;
  }

  getRating(p: Product): number {
    return Math.round(p.rating || 0);
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  addToCart(p: Product): void {
    console.log('Added to cart:', p);
  }
}