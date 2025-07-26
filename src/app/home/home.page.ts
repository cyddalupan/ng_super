import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AlertService } from '../services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  credentials: { username: string; password: string } = { username: '', password: '' };
  userError: string = '';
  isLoading: boolean = false;

  constructor(private apiService: ApiService, private alertService: AlertService, private router: Router) {}

  async login() {
    this.userError = '';
    if (!this.credentials.username || !this.credentials.password) {
      this.userError = 'Please enter username and password';
      return;
    }

    this.isLoading = true; // Show loading
    this.apiService.login(this.credentials).subscribe({
      next: async (res) => {
        localStorage.setItem('token', res.token); // Store JWT for agency/user CRUD
        this.isLoading = false; // Hide loading
        await this.alertService.showSuccess('Login successful');
        this.router.navigate(['/dashboard'], { replaceUrl: true }); // Navigate with replaceUrl to replace history
      },
      error: async (err) => {
        this.isLoading = false; // Hide loading
        if (err.status === 401) {
          this.userError = 'Invalid username or password.'; // In-app for user message
        } else {
          let message = err.error?.error || 'An error occurred. Please try again.';
          if (err.status === 0) {
            message = 'Cannot reach server. Check CORS or server status.';
          } else if (err.status === 500) {
            message = 'Server error. Try later.';
          } else if (err.status === 404) {
            message = 'API endpoint not found. Check server configuration.';
          }
          await this.alertService.showError(message, err); // Developer error with debug
        }
        console.error('Login error:', err);
      }
    });
  }
}