import { Component } from '@angular/core';
import { RouterLink,RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-hero',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {}
