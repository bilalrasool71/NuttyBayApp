import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth-service/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { baseURL } from '../constant/constant';
import { catchError, throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  let token = authService.isAuthenticated();
  const headers = {
    ...(token && req.url.startsWith(baseURL) ? { Authorization: `Bearer ${token}` } : {})
  };
  
  const clonedReq = req.clone({
    setHeaders: headers
  });

  return next(clonedReq).pipe(
    catchError((e: HttpErrorResponse) => {
      if(e.error?.message)
      if(e.status===0){
      }

      const error = e.error?.message || e.statusText;
      return throwError(() => new Error(error));
    })
  );
};
