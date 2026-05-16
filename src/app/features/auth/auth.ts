import { Component } from '@angular/core';
import { Userprofile } from './userprofile/userprofile';
import { Login } from './login/login';
import { Register } from './register/register';
@Component({
  selector: 'app-auth',
  imports: [Userprofile,Login,Register],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {}
