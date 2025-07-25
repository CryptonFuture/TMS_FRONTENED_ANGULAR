import { CanActivateFn, CanActivate, Router } from '@angular/router';
import { inject } from '@angular/core'
import { User } from '../../services/auth/user';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const _userServices = inject(User)

  if(_userServices.isLoggedInNot()) {
    return true
  } else {
    router.navigate(['']); 
    return false;
  }

};
