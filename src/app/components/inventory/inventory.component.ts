import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { InventoryService, InventoryProduct } from '../../services/inventory.service';
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
  searchQuery = '';
  selectedCategory = 'all';

  constructor(
    private inventoryService: InventoryService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.inventoryService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.toastService.error('Failed to load inventory');
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

  getLowStockCount(): number {
    return this.products.filter(p => p.stockLevel <= p.threshold).length;
  }

  isLowStock(product: InventoryProduct): boolean {
    return product.stockLevel <= product.threshold;
  }
}
