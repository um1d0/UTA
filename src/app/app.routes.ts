import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { About } from './features/about/about';
import { Contact } from './features/contact/contact';
import { Cart } from './features/cart/cart';
import { Auth } from './features/auth/auth';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Userprofile } from './features/auth/userprofile/userprofile';
import { AllProducts } from './features/all-products/all-products';
import { authGuard } from './shared/guards/auth-guard';
import { VerifyEmail } from './features/auth/register/verify-email/verify-email';
import { ProductDetails } from './features/product-details/product-details';
import { Favorites } from './features/favorites/favorites';
import { ForgotPassword } from './features/auth/forgot-password/forgot-password';
import { FeaturedProducts } from './features/home/featured-products/featured-products';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'about', component: About },
  { path: 'contact', component: Contact },
  { path: 'cart', component: Cart, canActivate: [authGuard] },
  { path: 'auth', component: Auth },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'userprofile', component: Userprofile, canActivate: [authGuard] },
  { path: 'allproducts', component: AllProducts },
  { path: 'products/:id', component: ProductDetails },
  { path: 'favorites', component: Favorites, canActivate: [authGuard] },
  { path: 'verify-email', component: VerifyEmail },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'featured-products', component: FeaturedProducts },

];
