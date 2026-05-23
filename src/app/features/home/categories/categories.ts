import { Component, inject } from '@angular/core';
import { RouterLink,RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-categories',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
   private router = inject(Router)

    getCategory(categoryID : number) {
        this.router.navigate(['/allproducts'], { queryParams: { categoryid: categoryID } });

    }
}
