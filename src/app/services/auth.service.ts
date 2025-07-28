import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // Named import for JWT decoding
import { AlertService } from './alert.service'; // Add for error messages

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router, private alertService: AlertService) {}

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now(); // Check if token expired
      if (isExpired) {
        this.logout(); // Auto logout on expired token
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  logout() {
    localStorage.removeItem('token'); // Clear JWT
    this.alertService.showError('Session expired, please log in again', {}); // User-friendly message
    this.router.navigate(['/']); // Navigate to login
  }
}