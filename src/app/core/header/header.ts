import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  cartCount = 0;
  Isopen = signal(false);
  open() {
    this.Isopen.update((x) => !x);
  }
  logo = 'https://cdn.discordapp.com/attachments/1500218140808708248/1502760884680921148/6EhsP0AAAAGSURBVAMAZivVqLh1cDAAAAAASUVORK5CYII.png?ex=6a00e2a2&is=69ff9122&hm=490297dd5844dbc3a6b545d1cf90971639b2a4b4b44f8ab5f3d330727bc045de&';
}
