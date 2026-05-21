import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { PipeNamePipe } from '../../pipe-name-pipe';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-all-products',
  imports: [CurrencyPipe, UpperCasePipe, PipeNamePipe,FormsModule],
  templateUrl: './all-products.html',
  styleUrl: './all-products.css',
})
export class AllProducts implements OnInit {
  private http = inject(HttpClient);

  productsList = signal<any>(null);
  page = 1;
  take = 12;
  inStockValue = signal<boolean | undefined>(undefined);
  SortDescending = signal<boolean | undefined>(undefined);
  CategoryId = signal<number | undefined>(undefined);
  RatingSignal = signal<number | undefined>(undefined);
  SortBySignal = signal<string | undefined>(undefined);
  MinPriceSignal = signal<number | undefined>(undefined);
  pages: number[] = [];
  ngOnInit() {
    this.getProducts();
  }

  getProducts(
    page: number = this.page,
    take: number = this.take,
    inStock: boolean | undefined = this.inStockValue(),

    Category: number | undefined = this.CategoryId(),
    Rating: number | undefined = this.RatingSignal(),
    Descending: boolean | undefined = this.SortDescending(),
    SortBy: string | undefined = this.SortBySignal(),
    MinPrice: number | undefined = this.MinPriceSignal()
  ) {
    const inStockParam = inStock !== undefined ? `&InStock=${inStock}` : '';
    const SortDecsendingParam = Descending !== undefined ? `&SortDescending=${Descending}` : '';
    const categoryParam = Category !== undefined ? `&CategoryId=${Category}` : '';
    const RatingParam = Rating !== undefined ? `&MinRating=${Rating}` : '';
    const SortByParam = SortBy !== undefined ? `&SortBy=${SortBy}` : '';
    const MinPriceParam = SortBy !== undefined ? `&MinPrice=${SortBy}` : '';

    this.http
      .get(
        `https://shopapi.stepacademy.ge/api/products/filter?Page=${page}&Take=${take}${categoryParam}${inStockParam}${RatingParam}${SortDecsendingParam}${SortByParam}${MinPriceParam}`,
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
          this.pages = [];
          for (let i = 1; i <= data.data.totalPages; i++) {
            this.pages.push(i);
          }
          console.log(page, take, inStock, this.pages);
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
  getSortBySomething(something:string | undefined) {
    const newValue = this.SortBySignal() === something ? undefined : something;
    this.SortBySignal.set(newValue);
    this.getProducts(
      1,
      this.take,
      this.inStockValue(),
      this.CategoryId(),
      this.RatingSignal(),this.SortDescending(),newValue,
    );
  }
   getSortBy(selectValue: string | undefined) {
    if (!selectValue) return;
    const [sortBy, descStr] = selectValue.split(' | ');
    const descending = descStr === 'true';
    this.SortBySignal.set(sortBy);
    this.SortDescending.set(descending);
    this.getProducts(1, this.take, this.inStockValue(), this.CategoryId(), this.RatingSignal(), descending, sortBy);
  }
  getMinPrice(price : number | undefined) {
    const newValue = this.MinPriceSignal() === price ? undefined : price;
    this.MinPriceSignal.set(newValue);
    this.getProducts(
      1,
      this.take,
      this.inStockValue(),
      this.CategoryId(),
      this.RatingSignal(),this.SortDescending(),this.SortBySignal(),newValue,
    );
  }
  
}
