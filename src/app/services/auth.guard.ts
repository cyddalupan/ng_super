import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // Change to named import

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token); // Change to jwtDecode
      if (decoded.user_type === 'superuser' && decoded.agency_id === null) {
        return true;
      }
    }
    this.router.navigate(['']);
    return false;
  }
}