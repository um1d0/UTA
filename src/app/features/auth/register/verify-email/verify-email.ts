import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Auth } from '../../../../shared/services/auth';
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-verify-email',
  imports: [RouterLink, RouterLinkActive, FormsModule],
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
ngOnInit() {
    this.setEmail();
  }
 
  onSubmit() {
    this.setEmail();
    console.log(this.GetEmailCode);

    this.http
      .put('https://shopapi.stepacademy.ge/api/auth/verify-email', this.GetEmailCode)
      .subscribe({
        next: () => {this.router.navigateByUrl('/login'),
          localStorage.removeItem('pendingEmail')
        },
        error: () => {alert('verify Failed'),
          console.log(this.GetEmailCode,)
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
