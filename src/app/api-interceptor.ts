import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');

  const requestWithHeaders = req.clone({
    setHeaders: {
      'X-API-KEY': '97b794e1-df90-4865-a5d5-a315b97d7b04',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return next(requestWithHeaders);
};
