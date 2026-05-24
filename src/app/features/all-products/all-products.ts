import { Component, inject, OnInit, signal } from '@angular/core';
import { PipeNamePipe } from '../../pipe-name-pipe';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../shared/services/cart';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FavoritesService } from '../../shared/services/favorites';
@Component({
  selector: 'app-all-products',
  imports: [PipeNamePipe, FormsModule, RouterLink],
  templateUrl: './all-products.html',
  styleUrl: './all-products.css',
})
export class AllProducts implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cartService = inject(CartService);
  private favoritesService = inject(FavoritesService);

  productsList = signal<any>(null);
  page = 1;
  take = 12;
  inStockValue = signal<boolean | undefined>(undefined);
  SortDescending = signal<boolean | undefined>(undefined);
  CategoryId = signal<number | undefined>(undefined);
  RatingSignal = signal<number | undefined>(undefined);
  SortBySignal = signal<string | undefined>(undefined);
  MinPriceSignal = signal<any | undefined>(undefined);
  MaxPriceSignal = signal<any | undefined>(undefined);
  TotalProductsSignal = signal<number | undefined>(undefined);
  BrandNameSignal = signal<string | undefined>(undefined);
  SearchSignal = signal<string | undefined>(undefined);
  filtersOpen = signal(false);
  pages: number[] = [];
  ngOnInit() {
    this.getCategories();

    this.route.queryParamMap.subscribe((params) => {
      const searchParam = params.get('search') ?? undefined;
      const categoryIdParam = params.get('categoryid') ?? params.get('categoryId');

      this.SearchSignal.set(searchParam);
      this.CategoryId.set(categoryIdParam ? Number(categoryIdParam) : undefined);
      this.getProducts(1, this.take);
    });
  }

  getProducts(
    page: number = this.page,
    take: number = this.take,
    inStock: boolean | undefined = this.inStockValue(),

    Category: number | undefined = this.CategoryId(),
    Rating: number | undefined = this.RatingSignal(),
    Descending: boolean | undefined = this.SortDescending(),
    SortBy: string | undefined = this.SortBySignal(),
    MinPrice: number | undefined = this.MinPriceSignal(),
    MaxPrice: number | undefined = this.MaxPriceSignal(),
    BrandName: string | undefined = this.BrandNameSignal(),
    Search: string | undefined = this.SearchSignal(),
  ) {
    const inStockParam = inStock !== undefined ? `&InStock=${inStock}` : '';
    const SortDecsendingParam = Descending !== undefined ? `&SortDescending=${Descending}` : '';
    const categoryParam = Category !== undefined ? `&CategoryId=${Category}` : '';
    const RatingParam = Rating !== undefined ? `&MinRating=${Rating}` : '';
    const SortByParam = SortBy !== undefined ? `&SortBy=${SortBy}` : '';
    const MinPriceParam = MinPrice !== undefined ? `&MinPrice=${MinPrice}` : '';
    const MaxPriceParam = MaxPrice !== undefined ? `&MaxPrice=${MaxPrice}` : '';
    const BrandNameParam = BrandName !== undefined ? `&Brand=${BrandName}` : '';
    const SearchParam = Search !== undefined ? `&Search=${Search}` : '';

    this.http
      .get(
        `https://shopapi.stepacademy.ge/api/products/filter?Page=${page}&Take=${take}${categoryParam}${inStockParam}${RatingParam}${SortDecsendingParam}${SortByParam}${MinPriceParam}${MaxPriceParam}${BrandNameParam}${SearchParam}`,
      )
      .subscribe({
        next: (data: any) => {
          this.productsList.set(data);
          this.page = page;
          this.take = take;

          this.inStockValue.set(inStock);
          this.CategoryId.set(Category);
          this.RatingSignal.set(Rating);
          this.SortDescending.set(Descending);
          this.SortBySignal.set(SortBy);
          this.TotalProductsSignal.set(data.data.totalCount);
          this.MinPriceSignal.set(MinPrice);
          this.MaxPriceSignal.set(MaxPrice);
          this.BrandNameSignal.set(BrandName);
          this.SearchSignal.set(Search);
          this.pages = [];

          for (let i = 1; i <= data.data.totalPages; i++) {
            this.pages.push(i);
          }
          console.log(this.MinPriceSignal());
        },
        error: (error) => {
          console.log(page, take, error, inStock, Category);
        },
      });
  }

  getProductsPreviousPage() {
    if (this.page > 1) {
      this.getProducts(this.page - 1, this.take);
    }
  }

  getProductsNextPage() {
    if (this.page < this.pages.length) {
      this.getProducts(this.page + 1, this.take);
    }
  }

  getStockStatus(status: boolean | undefined) {
    const newValue = this.inStockValue() === status ? undefined : status;
    this.inStockValue.set(newValue);
    this.getProducts(1, this.take, newValue);
  }
  getTakeCount(TakeCount: any) {
    this.getProducts(1, TakeCount, this.inStockValue());
  }
  getCategory(id: number) {
    const newValue = this.CategoryId() === id ? undefined : id;
    this.CategoryId.set(newValue);
    this.getProducts(1, this.take, this.inStockValue(), newValue);
  }
  getRating(rate: number) {
    const newValue = this.RatingSignal() === rate ? undefined : rate;
    this.RatingSignal.set(newValue);
    this.getProducts(1, this.take, this.inStockValue(), this.CategoryId(), newValue);
  }
  getDescending(status: boolean | undefined) {
    const newValue = this.SortDescending() === status ? undefined : status;
    this.SortDescending.set(newValue);
    this.getProducts(
      1,
      this.take,
      this.inStockValue(),
      this.CategoryId(),
      this.RatingSignal(),
      newValue,
    );
  }
  getSortBySomething(something: string | undefined) {
    const newValue = this.SortBySignal() === something ? undefined : something;
    this.SortBySignal.set(newValue);
    this.getProducts(
      1,
      this.take,
      this.inStockValue(),
      this.CategoryId(),
      this.RatingSignal(),
      this.SortDescending(),
      newValue,
    );
  }
  getSortBy(selectValue: string | undefined) {
    if (!selectValue) return;
    const [sortBy, descStr] = selectValue.split(' | ');
    const descending = descStr === 'true';
    this.SortBySignal.set(sortBy);
    this.SortDescending.set(descending);
    this.getProducts(
      1,
      this.take,
      this.inStockValue(),
      this.CategoryId(),
      this.RatingSignal(),
      descending,
      sortBy,
    );
  }

  autoSubmitPriceRange(min: any, max: any) {
    const MinnewValue = this.MinPriceSignal() === min ? undefined : min;
    const MaxnewValue = this.MaxPriceSignal() === max ? undefined : max;
    this.MinPriceSignal.set(min);
    this.MaxPriceSignal.set(max);
    this.getProducts(
      1,
      this.take,
      this.inStockValue(),
      this.CategoryId(),
      this.RatingSignal(),
      this.SortDescending(),
      this.SortBySignal(),
      min,
      max,
    );
  }
  getBrandName(Brand: string | undefined) {
    const newValue = this.BrandNameSignal() === Brand ? undefined : Brand;
    this.BrandNameSignal.set(newValue);
    this.getProducts(
      1,
      this.take,
      this.inStockValue(),
      this.CategoryId(),
      this.RatingSignal(),
      this.SortDescending(),
      this.SortBySignal(),
      this.MinPriceSignal(),
      this.MaxPriceSignal(),
      newValue,
    );
  }
  getSearch(something: string | undefined) {
    const newValue = this.SearchSignal() === something ? undefined : something;
    this.SearchSignal.set(newValue);
    this.getProducts(
      1,
      this.take,
      this.inStockValue(),
      this.CategoryId(),
      this.RatingSignal(),
      this.SortDescending(),
      this.SortBySignal(),
      this.MinPriceSignal(),
      this.MaxPriceSignal(),
      this.BrandNameSignal(),
      newValue,
    );
  }
  addToCart(productId: number): void {
    const token = localStorage.getItem('access_token');

    if (!token) {
      alert('You have to login first!');
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.addToCart(productId).subscribe({
      next: (res) => {
        console.log('Added To cart', res);
        alert('Product added to cart!');
      },
      error: (err) => {
        console.error('mistake:', err);
        alert(err?.error?.message ?? 'Could not add product to cart.');
      },
    });
  }

  toggleFavorite(product: any): void {
    const token = localStorage.getItem('access_token');

    if (!token) {
      alert('You have to login first!');
      this.router.navigate(['/login']);
      return;
    }

    const request = product.isFavorite
      ? this.favoritesService.removeFavorite(product.id)
      : this.favoritesService.addFavorite(product.id);

    request.subscribe({
      next: () => {
        product.isFavorite = !product.isFavorite;
      },
      error: (err) => {
        console.error('favorite mistake:', err);
        alert(err?.error?.message ?? 'Could not update favorite.');
      },
    });
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
}
