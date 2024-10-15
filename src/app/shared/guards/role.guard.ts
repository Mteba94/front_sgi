import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route } from '@angular/router';
import { AuthService } from 'src/app/pages/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const roles = next.data['roles'] as Array<string>;
    if (roles && !this.authService.hasRole(roles)) {
      this.router.navigate(['/access-denied']);
      return false;
    }
    return true;
  }

  // canLoad(route: Route): boolean {
  //   if (route.data && route.data.roles) {
  //     return this.authService.hasRole(route.data.roles);
  //   }
  //   return true;
  // }
  
}
