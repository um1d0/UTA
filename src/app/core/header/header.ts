import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive,],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
private http = inject(HttpClient);
  
  cartCount = 0;
  Isopen = signal(false);
  private router = inject(Router);
ngOnInit() {
    this.getCategories(); 
  }
  open() {
    this.Isopen.update((x) => !x);
  }

  isLoggedIn() {
    return !!localStorage.getItem('access_token');
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigateByUrl('/login');
  }
  Search(something: any) {
  if (!something) return;
  this.router.navigate(['/allproducts'], { queryParams: { search: something } });
}
getCategory(categoryID : any) {
        this.router.navigate(['/allproducts'], { queryParams: { categoryid: categoryID } });

    }

      Category = signal<any>(null);

    getCategories() {
    this.http.get('https://shopapi.stepacademy.ge/api/categories').subscribe({
      next: (data: any) => {
        this.Category.set(data.data);
        console.log(this.Category())
      },error : (error) => {
        console.log(error,this.Category())
      },
    }
     );
  }

  logo = 'assets/images/logo.png';
}