import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { About } from './features/about/about';
import { Contact } from './features/contact/contact';
import { Shop } from './features/shop/shop';

export const routes: Routes = [
    {path:'',component:Home,pathMatch:'full'},
    {path:'home',component:Home,},
    {path:'about',component:About},
    {path:'contact',component:Contact},
    {path:'shop',component:Shop},
];
