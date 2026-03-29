import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  readonly navItems = signal<NavItem[]>([
    { label: 'Dashboard', route: '/dashboard', icon: '📊' },
    { label: 'Fleet', route: '/fleet', icon: '🚛' },
    { label: 'Settings', route: '/settings', icon: '⚙️' },
  ]);
}
