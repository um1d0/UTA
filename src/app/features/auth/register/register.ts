import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Auth } from '../../../shared/services/auth';
@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private http = inject(HttpClient);
  private router = inject(Router);
  private Auth = inject(Auth)
  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  onSubmit() {
    const email = this.registerData.email.trim();

    this.Auth.pendingEmail.set(email);
    localStorage.setItem('pendingEmail', email);

    this.http.post('https://shopapi.stepacademy.ge/api/auth/register', {
      ...this.registerData,
      email,
    }).subscribe({
      next: () => {
        this.router.navigateByUrl('/verify-email');
      },
      error: (error) => {alert('Registration failed'),
   console.log(this.registerData,error)
      },
    });
    
  }
  GetverifyEmailPage() {
    const email = this.registerData.email.trim();

    this.Auth.pendingEmail.set(email)
    sessionStorage.setItem('pendingEmail', email);
    this.router.navigateByUrl('/verify-email')
  }
}
