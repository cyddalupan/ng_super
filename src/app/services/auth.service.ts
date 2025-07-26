import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Check if token exists (from /api/login with agency_id NULL)
  }

  logout() {
    localStorage.removeItem('token'); // Clear JWT for agency/user CRUD
    this.router.navigate(['/']); // Navigate to login
  }
}