import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DashboardStats {
    totalItems: number;
    lowStockAlerts: number;
}

export interface Product {
    id: number;
    name: string;
    stockLevel: number;
    threshold: number;
    price: number;
}

export interface Activity {
    id: number;
    title: string;
    subtitle: string;
    type: 'success' | 'info' | 'warning' | 'danger';
    status: string;
    timestamp: string;
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

    getRecentActivities(): Observable<Activity[]> {
        return this.http.get<Activity[]>(`${this.apiUrl}/activities`);
    }
}
