import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  Category = signal<any>(null);
  currentYear = new Date().getFullYear();
  logo = 'assets/images/logo.png';

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.http.get('https://shopapi.stepacademy.ge/api/categories').subscribe({
      next: (data: any) => {
        this.Category.set(data.data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getCategory(categoryID: any) {
    this.router.navigate(['/allproducts'], { queryParams: { categoryid: categoryID } });
  }

  isLoggedIn() {
    return !!localStorage.getItem('access_token');
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigateByUrl('/login');
  }
}