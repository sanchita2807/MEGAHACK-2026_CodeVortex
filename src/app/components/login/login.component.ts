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

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastService: ToastService
  ) { }

  onSubmit() {
    this.errorMessage = '';
    const loginData = {
      email: this.email,
      password: this.password
    };

    this.http.post(`${environment.apiUrl}/auth/login`, loginData).subscribe({
      next: (response: any) => {
        console.log('Login successful:', response);
        this.toastService.success('Login successful! Welcome back.');
        localStorage.setItem('token', response.token);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = error.error?.message || 'Invalid email or password';
        this.toastService.error(this.errorMessage);
      }
    });
  }

  navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
  }
}
