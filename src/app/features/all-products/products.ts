import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { productresponse } from '../../shared/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private url = 'https://shopapi.stepacademy.ge/api/products';

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get<productresponse>(this.url);
  }
}