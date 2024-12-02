import {Component, signal} from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {SidebarComponent} from '../sidebar/sidebar.component';
import {RightSideComponent} from '../right-side/right-side.component';
import {MainContentComponent} from '../main-content/main-content.component';
import {CommonModule} from '@angular/common';
type Theme = 'light' | 'dark';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    RightSideComponent,
    MainContentComponent,
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private _isDarkMode = signal<Theme>('light');

  isDarkMode = this._isDarkMode.asReadonly();

  toggleTheme() {
    this._isDarkMode.set(this._isDarkMode() === 'light' ? 'dark' : 'light');
  }
  isMobile: boolean = false;

  ngOnInit() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }

  // Optional: cleanup to prevent memory leaks
  ngOnDestroy() {
    window.removeEventListener('resize', this.checkScreenSize);}
}
