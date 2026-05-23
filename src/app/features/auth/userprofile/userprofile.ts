import { Component } from '@angular/core';
import { Favorites } from './favorites/favorites';
import { RouterLink,RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-userprofile',
  imports: [Favorites,RouterLink,RouterLinkActive],
  templateUrl: './userprofile.html',
  styleUrl: './userprofile.css',
})
export class Userprofile {
  logout(){
   localStorage.removeItem('access_token');
  }
}
