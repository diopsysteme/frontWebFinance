import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input({ alias: 'isDarkMode' }) theme: Theme = 'light';
  @Output() themeToggle = new EventEmitter<void>();
  @Output() mobileMenuToggle = new EventEmitter<void>();

  showNotifications = signal(false);
  showUserMenu = signal(false);
  unreadNotifications = 3; // Example value

  toggleNotifications() {
    this.showNotifications.set(!this.showNotifications());
  }

  toggleUserMenu() {
    this.showUserMenu.set(!this.showUserMenu());
  }

  onThemeToggle() {
    this.themeToggle.emit();
  }

  toggleMobileMenu() {
    this.mobileMenuToggle.emit();
  }
}
