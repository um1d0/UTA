import { Component } from '@angular/core';
import { Userprofile } from './userprofile/userprofile';
import { Login } from './login/login';
import { Register } from './register/register';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-auth',
  imports: [Userprofile, Login, Register, RouterOutlet],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {}
