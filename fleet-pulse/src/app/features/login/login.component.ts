import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  username = 'fleet.manager';
  password = 'Fleet@123';
  error = signal('');

  private static readonly VALID_USERNAME = 'fleet.manager';
  private static readonly VALID_PASSWORD = 'Fleet@123';

  onSubmit(): void {
    if (!this.username.trim() || !this.password.trim()) {
      this.error.set('Please enter both username and password.');
      return;
    }

    if (
      this.username.trim() !== LoginComponent.VALID_USERNAME ||
      this.password !== LoginComponent.VALID_PASSWORD
    ) {
      this.error.set('Invalid username or password.');
      return;
    }

    this.error.set('');
    this.authService.login(this.username.trim(), this.password);
    this.router.navigate(['/dashboard']);
  }
}
