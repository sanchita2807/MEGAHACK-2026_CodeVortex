import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  if (authService.isAuthenticated()) {
    router.navigate(['/home']);
    return false;
  }
  return true;
};
