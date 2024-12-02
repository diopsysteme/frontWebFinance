import { Component, Input, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

interface SidebarItem {
  icon: string;
  label: string;
  route: string; // Ajout de la propriété de route
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() isDarkMode = false;

  private breakpointObserver = inject(BreakpointObserver);

  isMobile = toSignal(
    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(map(result => result.matches)),
    { initialValue: false }
  );

  sidebarItems: SidebarItem[] = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'account_balance_wallet', label: 'Retrait', route: '/withdrawal' },
    { icon: 'account_balance', label: 'Dépôt', route: '/depot' },
    { icon: 'compare_arrows', label: 'Transfert', route: '/transfer' },
    { icon: 'credit_card', label: 'Achat Crédit', route: '/achat-credit' },
    { icon: 'account_balance', label: 'Banques', route: '/banques' },
    { icon: 'contacts', label: 'Contacts', route: '/contacts' }
  ];
}
