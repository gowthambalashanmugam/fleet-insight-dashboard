import { Component, inject, signal, HostListener } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);

  readonly dropdownOpen = signal(false);

  toggleDropdown(): void {
    this.dropdownOpen.update((v) => !v);
  }

  onLogout(): void {
    this.dropdownOpen.set(false);
    this.auth.logout();
  }

  onToggleTheme(): void {
    this.theme.toggle();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-menu')) {
      this.dropdownOpen.set(false);
    }
  }
}
