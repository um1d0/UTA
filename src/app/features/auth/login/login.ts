import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private http = inject(HttpClient);
  private router = inject(Router);

  LoginData = {
    email: '',
    password: '',
  };

  onSubmit() {
    this.http.post('https://shopapi.stepacademy.ge/api/auth/login', this.LoginData).subscribe({
      next: (data: any) => {
        localStorage.setItem('access_token', data.data.accessToken);
        localStorage.setItem('refresh_token', data.data.refreshToken);
        this.router.navigateByUrl('/');
      },
      error: () => alert('wrong information'),
    });
  }
}
