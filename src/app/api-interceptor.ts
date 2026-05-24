import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');

  const requestWithHeaders = req.clone({
    setHeaders: {
      'X-API-KEY': '97b794e1-df90-4865-a5d5-a315b97d7b04',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return next(requestWithHeaders).pipe(
    catchError((error) => {
      if (error.status === 401 && !req.url.includes('/api/auth/login')) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        router.navigate(['/login']);
      }

      return throwError(() => error);
    }),
  );
};
