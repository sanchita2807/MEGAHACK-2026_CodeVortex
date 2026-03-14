import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OcrService {
  private ocrUrl = `${environment.apiUrl}/ocr`;
  private invoiceUrl = `${environment.apiUrl}/invoice`;

  constructor(private http: HttpClient) {}

  processInvoice(formData: FormData): Observable<any> {
    return this.http.post(`${this.ocrUrl}/process`, formData);
  }

  saveInvoice(invoiceData: any): Observable<any> {
    return this.http.post(`${this.invoiceUrl}/save`, invoiceData);
  }
}
