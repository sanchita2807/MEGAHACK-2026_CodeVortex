import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { InventoryService, InventoryProduct } from '../../services/inventory.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { TranslationService, Translations } from '../../services/translation.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InventoryComponent implements OnInit {
  products: InventoryProduct[] = [];
  filteredProducts: InventoryProduct[] = [];
  searchQuery = '';
  showNotifications = false;
  showLogoutConfirm = false;
  t: Translations;
  notifications = [
    { id: 1, title: 'Low Stock Alert', message: 'Product A is running low', time: '2 min ago', read: false },
    { id: 2, title: 'Invoice Scanned', message: 'New invoice processed successfully', time: '1 hour ago', read: true }
  ];

  constructor(
    private inventoryService: InventoryService,
    private toastService: ToastService,
    private router: Router,
    private authService: AuthService,
    private translationService: TranslationService
  ) {
    this.t = this.translationService.current;
  }

  ngOnInit() {
    this.translationService.t$.subscribe(t => this.t = t);
    this.loadProducts();
  }

  loadProducts() {
    this.inventoryService.getAllProducts().subscribe({
      next: (data) => { this.products = data; this.filteredProducts = data; },
      error: (err) => { console.error(err); this.toastService.error('Failed to load inventory'); }
    });
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value.toLowerCase();
    this.filteredProducts = this.products.filter(p => p.name.toLowerCase().includes(this.searchQuery));
  }

  getLowStockCount(): number { return this.products.filter(p => p.stockLevel <= p.threshold).length; }
  isLowStock(product: InventoryProduct): boolean { return product.stockLevel <= product.threshold; }
  toggleNotifications() { this.showNotifications = !this.showNotifications; }
  logout() { this.showLogoutConfirm = true; }
  confirmLogout() { this.showLogoutConfirm = false; this.toastService.success('Logged out successfully'); this.authService.logout(); }
  cancelLogout() { this.showLogoutConfirm = false; }
  get unreadCount() { return this.notifications.filter(n => !n.read).length; }
}
