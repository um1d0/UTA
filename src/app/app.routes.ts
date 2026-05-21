import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { About } from './features/about/about';
import { Contact } from './features/contact/contact';
import { Shop } from './features/shop/shop';
import { Cart } from './features/cart/cart';
import { Auth } from './features/auth/auth';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Userprofile } from './features/auth/userprofile/userprofile';
import { AllProducts } from './features/all-products/all-products';
import { authGuard } from './shared/guards/auth-guard';
import { VerifyEmail } from './features/auth/register/verify-email/verify-email';


export const routes: Routes = [
    {path:'',component:Home,pathMatch:'full'},
    {path:'home',component:Home},
    {path:'about',component:About},
    {path:'contact',component:Contact},
    {path:'shop',component:Shop},
    {path:'cart',component:Cart, canActivate:[authGuard]},
    {path:'auth',component:Auth},
    {path:'login',component:Login},
    {path:'register',component:Register},
    {path:'userprofile',component:Userprofile},
    {path:'allproducts',component:AllProducts},
    {path:'verify-email',component:VerifyEmail},
];
