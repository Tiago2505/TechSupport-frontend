import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/user.model';
import { Chatbot } from '../../shared/components/chatbot/chatbot';

interface MenuItem {
  label: string;
  path: string;
  icon: string;
  exact?: boolean;
}

const ASSISTANT_ITEM: MenuItem = { label: 'Asistente IA', path: '/dashboard/assistant', icon: '🤖' };

const MENU_BY_ROLE: Record<UserRole, MenuItem[]> = {
  USER: [
    { label: 'Panel', path: '/dashboard', icon: '🏠', exact: true },
    { label: 'Mis Tickets', path: '/dashboard/tickets', icon: '🎫' },
    { label: 'Crear Ticket', path: '/dashboard/tickets/new', icon: '➕' },
    ASSISTANT_ITEM,
  ],
  TECHNICIAN: [
    { label: 'Panel', path: '/dashboard', icon: '🏠', exact: true },
    { label: 'Cola FIFO (Pendientes)', path: '/dashboard/queue', icon: '📥' },
    { label: 'Mis Gestiones', path: '/dashboard/my-work', icon: '🛠️' },
    ASSISTANT_ITEM,
  ],
  ADMIN: [
    { label: 'Dashboard Global', path: '/dashboard', icon: '🏠', exact: true },
    { label: 'Usuarios', path: '/dashboard/users', icon: '👥' },
    { label: 'Categorías', path: '/dashboard/categories', icon: '🏷️' },
    { label: 'Estadísticas', path: '/dashboard/stats', icon: '📈' },
  ],
};

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Chatbot],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = this.auth.currentUser;
  readonly role = this.auth.role;
  readonly roles: UserRole[] = ['USER', 'TECHNICIAN', 'ADMIN'];

  readonly roleLabels: Record<UserRole, string> = {
    USER: 'Cliente',
    TECHNICIAN: 'Técnico',
    ADMIN: 'Administrador',
  };

  readonly menu = computed<MenuItem[]>(() => {
    const role = this.role();
    return role ? MENU_BY_ROLE[role] : [];
  });

  onRoleChange(value: string): void {
    this.auth.setMockUser(value as UserRole);
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
