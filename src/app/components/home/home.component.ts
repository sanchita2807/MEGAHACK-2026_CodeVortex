import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DashboardService, DashboardStats, Product, Invoice } from '../../services/dashboard.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements OnInit {
  stats: DashboardStats = { totalItems: 0, lowStockAlerts: 0, invoicesScanned: 0, totalInventoryValue: 0 };
  lowStockProducts: Product[] = [];
  recentInvoices: Invoice[] = [];
  shopName = 'My Shop';

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadDashboardData();
  }

  loadUserData() {
    const shop = localStorage.getItem('shopName');
    if (shop) this.shopName = shop;
  }

  loadDashboardData() {
    this.dashboardService.getStats().subscribe({
      next: (data) => this.stats = data,
      error: (err) => {
        console.error('Error loading stats:', err);
        this.toastService.error('Failed to load dashboard stats');
      }
    });

    this.dashboardService.getLowStockProducts().subscribe({
      next: (data) => this.lowStockProducts = data.slice(0, 2),
      error: (err) => {
        console.error('Error loading low stock products:', err);
        this.toastService.error('Failed to load low stock products');
      }
    });

    this.dashboardService.getRecentInvoices().subscribe({
      next: (data) => this.recentInvoices = data.slice(0, 2),
      error: (err) => {
        console.error('Error loading invoices:', err);
        this.toastService.error('Failed to load recent invoices');
      }
    });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
