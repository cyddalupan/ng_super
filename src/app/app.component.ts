import { Component } from '@angular/core';
import { AuthService } from './services/auth.service'; // Add this import

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(public authService: AuthService) {} // Inject AuthService, make public for template
}