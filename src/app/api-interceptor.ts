import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  
    const requestWithApiKey = req.clone({
      setHeaders: {
        'X-API-KEY': '97b794e1-df90-4865-a5d5-a315b97d7b04',
      }
    })
  return next(requestWithApiKey);
};
