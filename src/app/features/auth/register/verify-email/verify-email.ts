import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Auth } from '../../../../shared/services/auth';
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-verify-email',
  imports: [RouterLink, FormsModule],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmail implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private Auth = inject(Auth);

  GetEmailCode = {
    email: '',
    code: '',
  };
  resendMessage = '';
  resendError = '';
  isResending = false;
  ngOnInit() {
    this.setEmail();
  }

  onSubmit() {
    this.setEmail();
    console.log(this.GetEmailCode);

    this.http
      .put('https://shopapi.stepacademy.ge/api/auth/verify-email', this.GetEmailCode)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/login');
          localStorage.removeItem('pendingEmail');
        },
        error: () => {
          alert('verify Failed');
          console.log(this.GetEmailCode);
        },
      });
  }

  resendCode() {
    if (!this.GetEmailCode.email) {
      this.resendError = 'Email address not found. Please register first.';
      return;
    }

    this.resendMessage = '';
    this.resendError = '';
    this.isResending = true;

    const headers = { 'X-API-KEY': '97b794e1-df90-4865-a5d5-a315b97d7b04' };

    this.http
      .post(
        `https://shopapi.stepacademy.ge/api/auth/resend-email-verification/${this.GetEmailCode.email}`,
        {},
        { headers },
      )
      .subscribe({
        next: (res: any) => {
          this.isResending = false;
          this.resendMessage = res.data || 'Verification code sent successfully';
        },
        error: (err) => {
          this.isResending = false;
          this.resendError = err?.error?.message || 'Failed to resend code. Try again later.';
        },
      });
  }

  private setEmail() {
    this.GetEmailCode.email =
      this.GetEmailCode.email ||
      this.Auth.pendingEmail() ||
      sessionStorage.getItem('pendingEmail') ||
      '';
  }
}
