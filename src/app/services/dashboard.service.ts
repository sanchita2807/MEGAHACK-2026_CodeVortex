import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DashboardStats {
    totalItems: number;
    lowStockAlerts: number;
    invoicesScanned: number;
    totalInventoryValue: number;
}

export interface Product {
    id: number;
    name: string;
    stockLevel: number;
    threshold: number;
    price: number;
}

export interface Invoice {
    id?: number;
    vendor: string;
    date: string;
    status: string;
    items: number;
    amount: string;
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private apiUrl = `${environment.apiUrl}/dashboard`;

    constructor(private http: HttpClient) { }

    getStats(): Observable<DashboardStats> {
        return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
    }

    getLowStockProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}/low-stock`);
    }

    getRecentInvoices(): Observable<Invoice[]> {
        return this.http.get<Invoice[]>(`${this.apiUrl}/invoices`);
    }

    exportToExcel(): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/export/excel`, { responseType: 'blob' });
    }

    syncWithTally(): Observable<any> {
        return this.http.post(`${this.apiUrl}/sync/tally`, {});
    }
}
