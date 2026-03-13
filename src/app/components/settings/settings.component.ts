import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SettingsComponent implements OnInit {
  userName = 'User';
  userEmail = '';
  shopName = 'My Shop';
  businessType = '';
  showEditModal = false;
  showLanguageModal = false;
  showHelpModal = false;
  
  availableLanguages = [
    { code: 'en', name: 'English', selected: true },
    { code: 'hi', name: 'हिंदी (Hindi)', selected: false },
    { code: 'mr', name: 'मराठी (Marathi)', selected: false },
    { code: 'gu', name: 'ગુજરાતી (Gujarati)', selected: false },
    { code: 'ta', name: 'தமிழ் (Tamil)', selected: false },
    { code: 'te', name: 'తెలుగు (Telugu)', selected: false },
    { code: 'bn', name: 'বাংলা (Bengali)', selected: false },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', selected: false }
  ];
  
  editForm = {
    name: '',
    shopName: '',
    businessType: ''
  };

  constructor(
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService,
    public langService: LanguageService
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    const name = localStorage.getItem('userName');
    const shop = localStorage.getItem('shopName');
    const businessType = localStorage.getItem('businessType');
    
    if (email) this.userEmail = email;
    if (name) this.userName = name;
    if (shop) this.shopName = shop;
    if (businessType) this.businessType = businessType;
  }

  openEditModal() {
    this.editForm.name = this.userName;
    this.editForm.shopName = this.shopName;
    this.editForm.businessType = this.businessType;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  saveProfile() {
    if (this.editForm.name.trim()) {
      this.userName = this.editForm.name;
      localStorage.setItem('userName', this.userName);
    }
    if (this.editForm.shopName.trim()) {
      this.shopName = this.editForm.shopName;
      localStorage.setItem('shopName', this.shopName);
    }
    if (this.editForm.businessType.trim()) {
      this.businessType = this.editForm.businessType;
      localStorage.setItem('businessType', this.businessType);
    }
    this.toastService.success('Profile updated successfully');
    this.closeEditModal();
  }

  openLanguageModal() {
    const saved = localStorage.getItem('selectedLanguage');
    this.availableLanguages.forEach(lang => {
      lang.selected = saved ? lang.code === saved : lang.code === 'en';
    });
    this.showLanguageModal = true;
  }

  closeLanguageModal() {
    this.showLanguageModal = false;
  }

  toggleLanguage(lang: any) {
    this.availableLanguages.forEach(l => l.selected = false);
    lang.selected = true;
  }

  saveLanguages() {
    const selected = this.availableLanguages.find(l => l.selected);
    if (!selected) {
      this.toastService.error('Please select a language');
      return;
    }
    this.langService.setLanguage(selected.code);
    this.toastService.success('Language updated successfully');
    this.closeLanguageModal();
  }

  getSelectedLanguages(): string {
    const saved = localStorage.getItem('selectedLanguage');
    if (saved) {
      const lang = this.availableLanguages.find(l => l.code === saved);
      return lang ? lang.name.split(' ')[0] : 'English';
    }
    return 'English';
  }

  openHelpModal() {
    this.showHelpModal = true;
  }

  closeHelpModal() {
    this.showHelpModal = false;
  }

  logout() {
    this.authService.logout();
    this.toastService.success('Logged out successfully');
    this.router.navigate(['/login']);
  }
}
