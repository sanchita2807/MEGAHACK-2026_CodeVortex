import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DashboardService, DashboardStats } from '../../services/dashboard.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportsComponent implements OnInit {
  stats: DashboardStats = { totalItems: 0, lowStockAlerts: 0, invoicesScanned: 0, totalInventoryValue: 0 };

  constructor(
    private dashboardService: DashboardService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.dashboardService.getStats().subscribe({
      next: (data) => this.stats = data,
      error: (err) => {
        console.error('Error loading stats:', err);
        this.toastService.error('Failed to load statistics');
      }
    });
  }

  exportToExcel() {
    this.dashboardService.exportToExcel().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventory-export-${new Date().getTime()}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.toastService.success('Excel export downloaded successfully');
      },
      error: (err) => {
        console.error('Error exporting to Excel:', err);
        this.toastService.error('Failed to export to Excel');
      }
    });
  }

  syncWithTally() {
    this.dashboardService.syncWithTally().subscribe({
      next: (response) => {
        this.toastService.success(response.message || 'Tally sync completed successfully');
        this.loadStats();
      },
      error: (err) => {
        console.error('Error syncing with Tally:', err);
        this.toastService.error('Failed to sync with Tally');
      }
    });
  }
}
