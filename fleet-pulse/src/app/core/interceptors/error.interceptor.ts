import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      // TODO: implement global error handling (toast, logging, etc.)
      console.error('HTTP Error:', error);
      return throwError(() => error);
    })
  );
};
