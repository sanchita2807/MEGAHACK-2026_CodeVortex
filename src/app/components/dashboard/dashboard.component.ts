import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService, DashboardStats, Product, Invoice } from '../../services/dashboard.service';
import { ToastService } from '../../services/toast.service';
import { CameraModalComponent } from '../camera-modal/camera-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CameraModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardComponent implements OnInit {
  @ViewChild(CameraModalComponent) cameraModal!: CameraModalComponent;

  stats: DashboardStats = { totalItems: 0, lowStockAlerts: 0, invoicesScanned: 0, totalInventoryValue: 0 };
  lowStockProducts: Product[] = [];
  recentInvoices: Invoice[] = [];

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.dashboardService.getStats().subscribe({
      next: (data) => this.stats = data,
      error: (err) => {
        console.error('Error fetching stats:', err);
        this.toastService.error('Failed to load dashboard stats');
      }
    });

    this.dashboardService.getLowStockProducts().subscribe({
      next: (data) => this.lowStockProducts = data,
      error: (err) => {
        console.error('Error fetching low stock products:', err);
        this.toastService.error('Failed to load low stock products');
      }
    });

    this.dashboardService.getRecentInvoices().subscribe({
      next: (data) => this.recentInvoices = data,
      error: (err) => {
        console.error('Error fetching invoices:', err);
        this.toastService.error('Failed to load recent invoices');
      }
    });
  }

  openScanInvoice() {
    if (this.cameraModal) {
      this.cameraModal.openCamera();
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  exportToExcel() {
    this.dashboardService.exportToExcel().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventory-${new Date().getTime()}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.toastService.success('Inventory exported successfully');
      },
      error: (err) => {
        console.error('Error exporting to Excel:', err);
        this.toastService.error('Failed to export inventory');
      }
    });
  }

  syncWithTally() {
    this.dashboardService.syncWithTally().subscribe({
      next: (response) => {
        this.toastService.success(response.message || 'Synced with Tally successfully');
        this.loadDashboardData();
      },
      error: (err) => {
        console.error('Error syncing with Tally:', err);
        this.toastService.error('Failed to sync with Tally');
      }
    });
  }
}
