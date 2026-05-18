import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private http = inject(HttpClient);
  private router = inject(Router);

  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  onSubmit() {
    this.http.post('https://shopapi.stepacademy.ge/api/auth/register', this.registerData).subscribe({
      next: () => this.router.navigateByUrl('/login'),
      error: () => alert('Registration failed'),
    });
  }
}