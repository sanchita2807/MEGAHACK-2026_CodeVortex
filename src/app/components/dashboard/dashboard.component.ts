import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardStats, Product, Activity } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = { totalItems: 0, lowStockAlerts: 0 };
  lowStockProducts: Product[] = [];
  recentActivities: Activity[] = [];

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.dashboardService.getStats().subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error('Error fetching stats:', err)
    });

    this.dashboardService.getLowStockProducts().subscribe({
      next: (data) => this.lowStockProducts = data,
      error: (err) => console.error('Error fetching low stock products:', err)
    });

    this.dashboardService.getRecentActivities().subscribe({
      next: (data) => this.recentActivities = data,
      error: (err) => console.error('Error fetching activities:', err)
    });
  }
}
