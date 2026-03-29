import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  // TODO: implement actual auth check
  return true;
};
