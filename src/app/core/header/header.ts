import { Component, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  cartCount = 0;
  Isopen = signal(false);
  private router = inject(Router);

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

  logo = 'https://cdn.discordapp.com/attachments/1476594927629504720/1506001464106029197/6EhsP0AAAAGSURBVAMAZivVqLh1cDAAAAAASUVORK5CYII.png?ex=6a0caca9&is=6a0b5b29&hm=54b5564f2825d24ff877149247c93f95fc36051762202cebec9a250638310662&';
}