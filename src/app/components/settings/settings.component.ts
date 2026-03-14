import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { SkeletonComponent } from '../skeleton/skeleton.component';
import { TranslationService, Translations } from '../../services/translation.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive, SkeletonComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SettingsComponent implements OnInit {
  userName = 'User';
  userEmail = '';
  shopName = 'My Shop';
  showLogoutConfirm = false;
  showNotifications = false;
  isLoading = true;
  t!: Translations;

  showLanguageModal = false;
  selectedLanguage = 'English';
  languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' }
  ];

  notificationsEnabled = true;
  autoBackupEnabled = false;

  showThresholdModal = false;
  lowStockThreshold = 5;
  tempThreshold = 5;

  showTallyModal = false;
  tallyCompanyName = '';
  tallyExportFormat = 'xml';
  tallyAutoSync = false;

  showHelpModal = false;

  notifications = [
    { id: 1, title: 'Low Stock Alert', message: 'Product A is running low', time: '2 min ago', read: false },
    { id: 2, title: 'Invoice Scanned', message: 'New invoice processed successfully', time: '1 hour ago', read: true }
  ];

  constructor(
    private toastService: ToastService,
    private authService: AuthService,
    private translationService: TranslationService
  ) {}

  ngOnInit() {
    this.t = this.translationService.current;
    this.translationService.t$.subscribe(t => this.t = t);
    this.loadUserData();
    this.loadSavedSettings();
    setTimeout(() => { this.isLoading = false; }, 300);
  }

  loadUserData() {
    const email = localStorage.getItem('userEmail');
    const name = localStorage.getItem('userName');
    const shop = localStorage.getItem('shopName');
    if (email) this.userEmail = email;
    if (name) this.userName = name;
    if (shop) this.shopName = shop;
  }

  loadSavedSettings() {
    const threshold = localStorage.getItem('lowStockThreshold');
    const tallyCompany = localStorage.getItem('tallyCompanyName');
    const tallyFormat = localStorage.getItem('tallyExportFormat');
    const tallySync = localStorage.getItem('tallyAutoSync');
    const lang = localStorage.getItem('appLanguage');
    const notifEnabled = localStorage.getItem('notificationsEnabled');
    const autoBackup = localStorage.getItem('autoBackupEnabled');

    if (threshold) this.lowStockThreshold = +threshold;
    if (tallyCompany) this.tallyCompanyName = tallyCompany;
    if (tallyFormat) this.tallyExportFormat = tallyFormat;
    if (tallySync) this.tallyAutoSync = tallySync === 'true';
    if (lang) this.selectedLanguage = lang;
    if (notifEnabled !== null) this.notificationsEnabled = notifEnabled === 'true';
    if (autoBackup !== null) this.autoBackupEnabled = autoBackup === 'true';
  }

  openLanguageModal() { this.showLanguageModal = true; }

  selectLanguage(lang: { code: string; label: string; native: string }) {
    this.selectedLanguage = lang.label;
    this.translationService.setLanguage(lang.label);
    this.showLanguageModal = false;
    this.toastService.success(`Language changed to ${lang.label} (${lang.native})`);
  }

  toggleNotificationsEnabled() {
    this.notificationsEnabled = !this.notificationsEnabled;
    localStorage.setItem('notificationsEnabled', String(this.notificationsEnabled));
    this.toastService.success(this.notificationsEnabled ? 'Notifications enabled' : 'Notifications disabled');
  }

  toggleAutoBackup() {
    this.autoBackupEnabled = !this.autoBackupEnabled;
    localStorage.setItem('autoBackupEnabled', String(this.autoBackupEnabled));
    this.toastService.success(this.autoBackupEnabled ? 'Auto-backup enabled' : 'Auto-backup disabled');
  }

  openThresholdModal() {
    this.tempThreshold = this.lowStockThreshold;
    this.showThresholdModal = true;
  }

  saveThreshold() {
    if (this.tempThreshold < 1) this.tempThreshold = 1;
    this.lowStockThreshold = this.tempThreshold;
    localStorage.setItem('lowStockThreshold', String(this.lowStockThreshold));
    this.showThresholdModal = false;
    this.toastService.success(`Low stock threshold set to ${this.lowStockThreshold} items`);
  }

  openTallyModal() { this.showTallyModal = true; }

  saveTallySettings() {
    localStorage.setItem('tallyCompanyName', this.tallyCompanyName);
    localStorage.setItem('tallyExportFormat', this.tallyExportFormat);
    localStorage.setItem('tallyAutoSync', String(this.tallyAutoSync));
    this.showTallyModal = false;
    this.toastService.success('Tally export settings saved');
  }

  openHelpModal() { this.showHelpModal = true; }

  logout() { this.showLogoutConfirm = true; }
  confirmLogout() { this.showLogoutConfirm = false; this.toastService.success('Logged out successfully'); this.authService.logout(); }
  cancelLogout() { this.showLogoutConfirm = false; }
  toggleNotifications() { this.showNotifications = !this.showNotifications; }
  get unreadCount() { return this.notifications.filter(n => !n.read).length; }
}
