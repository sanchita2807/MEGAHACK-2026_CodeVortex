import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SettingsComponent } from './components/settings/settings.component';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'register', component: RegistrationComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'inventory', component: InventoryComponent, canActivate: [authGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [authGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [authGuard] }
];
