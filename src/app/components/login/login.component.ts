import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastService: ToastService
  ) { }

  onSubmit() {
    this.errorMessage = '';
    this.loading = true;

    const loginData = {
      email: this.email,
      password: this.password
    };

    this.http.post(`${environment.apiUrl}/auth/login-user`, loginData).subscribe({
      next: (response: any) => {
        this.loading = false;
        console.log('User login response:', response);

        if (response.success) {
          this.toastService.success('Login successful! Welcome back.');
          localStorage.setItem('token', response.token);
          localStorage.setItem('userEmail', this.email);
          localStorage.setItem('userType', '0');
          localStorage.setItem('userName', response.name || '');
          localStorage.setItem('shopName', response.shopName || '');
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = response.message || 'Login failed';
          this.toastService.error(this.errorMessage);
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Login error:', error);

        if (error.status === 403) {
          this.errorMessage = 'Access denied. Only regular users can login here.';
        } else if (error.status === 400) {
          this.errorMessage = error.error?.message || 'Invalid email or password';
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
        this.toastService.error(this.errorMessage);
      }
    });
  }

  navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
  }
}
