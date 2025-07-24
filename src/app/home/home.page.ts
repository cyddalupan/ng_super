import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  credentials: { username: string; password: string } = { username: '', password: '' };
  error: string = '';
  isLoading: boolean = false;

  constructor(private apiService: ApiService) {}

  login() {
    if (this.credentials.username && this.credentials.password) { // Simple validation to trigger load only if filled
      this.isLoading = true;
      this.apiService.login(this.credentials).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token); // Store JWT for agency/user CRUD
          this.error = '';
          this.isLoading = false;
          console.log('Login successful', res);
        },
        error: (err) => {
          this.error = err.error?.error || 'Login failed';
          this.isLoading = false;
          console.error(err);
        }
      });
    } else {
      this.error = 'Please fill in username and password';
    }
  }
}