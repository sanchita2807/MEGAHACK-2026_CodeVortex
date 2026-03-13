import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly USER_EMAIL_KEY = 'userEmail';
  private readonly USER_TYPE_KEY = 'userType';
  private readonly USER_NAME_KEY = 'userName';
  private readonly SHOP_NAME_KEY = 'shopName';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/login-user`, { email, password })
      .pipe(
        tap((response: any) => {
          console.log('Login response:', response);
          if (response && response.token) {
            console.log('Storing token:', response.token);
            this.storeToken(response.token);
            this.storeUserData(email, response.name, response.shopName);
            console.log('Token stored. Verification:', this.getToken());
          } else {
            console.error('No token in response:', response);
          }
        })
      );
  }

  storeToken(token: string): void {
    console.log('Storing JWT token in localStorage:', token);
    localStorage.setItem(this.TOKEN_KEY, token);
    console.log('Token stored successfully. Retrieved:', localStorage.getItem(this.TOKEN_KEY));
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  storeUserData(email: string, name?: string, shopName?: string): void {
    localStorage.setItem(this.USER_EMAIL_KEY, email);
    localStorage.setItem(this.USER_TYPE_KEY, '0');
    if (name) localStorage.setItem(this.USER_NAME_KEY, name);
    if (shopName) localStorage.setItem(this.SHOP_NAME_KEY, shopName);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserEmail(): string | null {
    return localStorage.getItem(this.USER_EMAIL_KEY);
  }

  getUserName(): string | null {
    return localStorage.getItem(this.USER_NAME_KEY);
  }

  getShopName(): string | null {
    return localStorage.getItem(this.SHOP_NAME_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_EMAIL_KEY);
    localStorage.removeItem(this.USER_TYPE_KEY);
    localStorage.removeItem(this.USER_NAME_KEY);
    localStorage.removeItem(this.SHOP_NAME_KEY);
  }
}
