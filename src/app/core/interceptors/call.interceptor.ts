import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { LoadingService } from '../services/loading-service/loading.service';

export const callInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const loadingService = inject(LoadingService);


  loadingService.setLoading(true, req.url);
  console.info("Loading Started");
  return next(req).pipe(
    catchError((err) => {
      loadingService.setLoading(false, req.url);

      throw err;
    }),
    map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
      if (evt instanceof HttpResponse) {
        loadingService.setLoading(false, req.url);
        console.info("Loading End");
      }
      return evt;
    })
  );
};
