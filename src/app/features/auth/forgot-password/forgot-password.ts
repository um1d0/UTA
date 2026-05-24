import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  private http = inject(HttpClient);

  forgotEmail = '';
  forgotMessage = '';
  forgotError = '';
  isSent = false;

  onForgotSubmit() {
    this.forgotMessage = 'If the email exists, a reset link has been sent.';
    this.forgotError = '';
    this.isSent = true;

    const headers = { 'X-API-KEY': '97b794e1-df90-4865-a5d5-a315b97d7b04' };

    this.http
      .post(
        `https://shopapi.stepacademy.ge/api/auth/forget-password/${this.forgotEmail}`,
        {},
        { headers },
      )
      .subscribe({
        next: (res: any) => {
          this.forgotMessage = res.data || this.forgotMessage;
        },
        error: (err) => {
          this.isSent = false;
          this.forgotError = err?.error?.message || 'Something went wrong. Please try again.';
        },
      });
  }
}
