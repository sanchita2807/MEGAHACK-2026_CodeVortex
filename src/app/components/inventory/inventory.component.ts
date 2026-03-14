import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { InventoryService, InventoryProduct } from '../../services/inventory.service';
import { DashboardService, Invoice } from '../../services/dashboard.service';
import { ToastService } from '../../services/toast.service';

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
  invoices: Invoice[] = [];
  searchQuery = '';
  selectedTab = 'products';
  lowStockCount = 0;

  constructor(
    private inventoryService: InventoryService,
    private dashboardService: DashboardService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadInvoices();
  }

  loadProducts() {
    this.inventoryService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.lowStockCount = data.filter(p => p.stockLevel <= p.threshold).length;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.toastService.error('Failed to load inventory');
      }
    });
  }

  loadInvoices() {
    this.dashboardService.getRecentInvoices().subscribe({
      next: (data) => {
        this.invoices = data;
      },
      error: (err) => {
        console.error('Error loading invoices:', err);
        this.toastService.error('Failed to load invoices');
      }
    });
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value.toLowerCase();
    this.filterProducts();
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(p => 
      p.name.toLowerCase().includes(this.searchQuery)
    );
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  getLowStockCount(): number {
    return this.lowStockCount;
  }

  isLowStock(product: InventoryProduct): boolean {
    return product.stockLevel <= product.threshold;
  }

  refreshData() {
    this.loadProducts();
    this.loadInvoices();
    this.toastService.success('Inventory refreshed');
  }
}
