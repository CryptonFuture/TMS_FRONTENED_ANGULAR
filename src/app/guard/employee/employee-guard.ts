import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core'
import { User } from '../../services/auth/user';

export const employeeGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const _userServices = inject(User)

  if(_userServices.isLoggedIn()) {
    return true
  } else {
    router.navigate(['/dashboard']); 
    return false;
  }
};
