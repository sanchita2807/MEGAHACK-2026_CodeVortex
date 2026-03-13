import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface InventoryProduct {
    id: number;
    name: string;
    stockLevel: number;
    threshold: number;
    price: number;
}

@Injectable({
    providedIn: 'root'
})
export class InventoryService {
    private apiUrl = `${environment.apiUrl}/inventory`;

    constructor(private http: HttpClient) { }

    getAllProducts(): Observable<InventoryProduct[]> {
        return this.http.get<InventoryProduct[]>(`${this.apiUrl}/products`);
    }

    addProduct(product: InventoryProduct): Observable<InventoryProduct> {
        return this.http.post<InventoryProduct>(`${this.apiUrl}/products`, product);
    }

    updateProduct(id: number, product: InventoryProduct): Observable<InventoryProduct> {
        return this.http.put<InventoryProduct>(`${this.apiUrl}/products/${id}`, product);
    }

    deleteProduct(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
    }
}
