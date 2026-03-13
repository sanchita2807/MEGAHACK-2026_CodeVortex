import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegistrationComponent {
  name = '';
  email = '';
  phone = '';
  shopName = '';
  businessType = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastService: ToastService
  ) { }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      this.toastService.error(this.errorMessage);
      return;
    }

    const registrationData = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      shopName: this.shopName,
      businessType: this.businessType,
      password: this.password
    };

    this.http.post(`${environment.apiUrl}/auth/register`, registrationData).subscribe({
      next: (response: any) => {
        console.log('Registration successful:', response);
        this.successMessage = response.message || 'Registration successful!';
        this.toastService.success(this.successMessage);

        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userEmail', this.email);
          localStorage.setItem('userName', this.name);
          localStorage.setItem('shopName', this.shopName);
        }

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        this.toastService.error(this.errorMessage);
      }
    });
  }

  navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
  }
}
