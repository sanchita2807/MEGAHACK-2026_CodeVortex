import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SettingsComponent implements OnInit {
  userName = 'User';
  userEmail = '';
  shopName = 'My Shop';
  showLogoutConfirm = false;
  showNotifications = false;
  notifications = [
    { id: 1, title: 'Low Stock Alert', message: 'Product A is running low', time: '2 min ago', read: false },
    { id: 2, title: 'Invoice Scanned', message: 'New invoice processed successfully', time: '1 hour ago', read: true }
  ];

  constructor(
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    const name = localStorage.getItem('userName');
    const shop = localStorage.getItem('shopName');
    
    if (email) this.userEmail = email;
    if (name) this.userName = name;
    if (shop) this.shopName = shop;
  }

  logout() {
    this.showLogoutConfirm = true;
  }

  confirmLogout() {
    this.showLogoutConfirm = false;
    this.toastService.success('Logged out successfully');
    this.authService.logout();
  }

  cancelLogout() {
    this.showLogoutConfirm = false;
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  get unreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }
}
