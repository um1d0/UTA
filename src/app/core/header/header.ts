import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  Isopen = signal(false);
  open() {
    this.Isopen.update(x => !x);
  }
  
}
