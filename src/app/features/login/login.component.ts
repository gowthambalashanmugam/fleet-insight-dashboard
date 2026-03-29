import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly router = inject(Router);

  username = '';
  password = '';
  error = signal('');

  onSubmit() {
    if (!this.username || !this.password) {
      console.log('Please enter both username and password')
      this.error.set('Please enter both username and password.');
      return;
    }
    this.error.set('');
    this.router.navigate(['/dashboard']);
  }
}
