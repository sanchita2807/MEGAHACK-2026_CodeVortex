import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Translations {
  // Nav
  home: string;
  inventory: string;
  reports: string;
  settings: string;
  // Home
  scanInvoice: string;
  scanDesc: string;
  totalItems: string;
  lowStockAlerts: string;
  lowStockAlertsTitle: string;
  viewAll: string;
  onlyLeft: string;
  reorder: string;
  recentActivity: string;
  itemsAdded: string;
  noLowStock: string;
  noRecentActivity: string;
  // Inventory
  searchPlaceholder: string;
  allItems: string;
  lowStock: string;
  noProductsFound: string;
  inStock: string;
  // Reports
  exportData: string;
  exportDesc: string;
  excelFormat: string;
  tallyExport: string;
  totalInventoryValue: string;
  invoicesScanned: string;
  stockIntakeTrend: string;
  recentReports: string;
  // Settings
  managePreferences: string;
  preferences: string;
  language: string;
  notifications: string;
  lowStockThreshold: string;
  integrationsExport: string;
  tallyExportSettings: string;
  autoBackupCloud: string;
  other: string;
  helpSupport: string;
  logOut: string;
  // Notifications panel
  notificationsTitle: string;
  noNotifications: string;
  // Logout modal
  logoutConfirmTitle: string;
  logoutConfirmMsg: string;
  yes: string;
  no: string;
}

const en: Translations = {
  home: 'Home', inventory: 'Inventory', reports: 'Reports', settings: 'Settings',
  scanInvoice: 'Scan Invoice', scanDesc: 'Auto-extract details & sync inventory instantly via OCR.',
  totalItems: 'Total Items', lowStockAlerts: 'Low Stock Alerts', lowStockAlertsTitle: 'Low-Stock Alerts',
  viewAll: 'View All', onlyLeft: 'Only {n} left in stock', reorder: 'Reorder',
  recentActivity: 'Recent Activity', itemsAdded: 'items added', noLowStock: 'No low stock items', noRecentActivity: 'No recent activity',
  searchPlaceholder: 'Search items, SKU, or categories...', allItems: 'All Items', lowStock: 'Low Stock', noProductsFound: 'No products found', inStock: 'in stock',
  exportData: 'Export Data', exportDesc: 'Download inventory and scan history for your accounting software.',
  excelFormat: 'Excel Format', tallyExport: 'Tally Export',
  totalInventoryValue: 'Total Inventory Value', invoicesScanned: 'Invoices Scanned',
  stockIntakeTrend: 'Stock Intake Trend', recentReports: 'Recent Reports',
  managePreferences: 'Manage your app preferences', preferences: 'Preferences',
  language: 'Language', notifications: 'Notifications', lowStockThreshold: 'Low Stock Threshold',
  integrationsExport: 'Integrations & Export', tallyExportSettings: 'Tally Export Settings', autoBackupCloud: 'Auto-Backup to Cloud',
  other: 'Other', helpSupport: 'Help & Support', logOut: 'Log Out',
  notificationsTitle: 'Notifications', noNotifications: 'No notifications',
  logoutConfirmTitle: 'Logout Confirmation', logoutConfirmMsg: 'Are you sure you want to logout?', yes: 'Yes', no: 'No'
};

const hi: Translations = {
  home: 'होम', inventory: 'इन्वेंटरी', reports: 'रिपोर्ट', settings: 'सेटिंग्स',
  scanInvoice: 'इनवॉइस स्कैन करें', scanDesc: 'OCR के जरिए विवरण निकालें और इन्वेंटरी तुरंत सिंक करें।',
  totalItems: 'कुल आइटम', lowStockAlerts: 'कम स्टॉक अलर्ट', lowStockAlertsTitle: 'कम स्टॉक अलर्ट',
  viewAll: 'सभी देखें', onlyLeft: 'केवल {n} बचे हैं', reorder: 'पुनः ऑर्डर करें',
  recentActivity: 'हाल की गतिविधि', itemsAdded: 'आइटम जोड़े गए', noLowStock: 'कोई कम स्टॉक आइटम नहीं', noRecentActivity: 'कोई हाल की गतिविधि नहीं',
  searchPlaceholder: 'आइटम, SKU या श्रेणी खोजें...', allItems: 'सभी आइटम', lowStock: 'कम स्टॉक', noProductsFound: 'कोई उत्पाद नहीं मिला', inStock: 'स्टॉक में',
  exportData: 'डेटा निर्यात करें', exportDesc: 'अपने अकाउंटिंग सॉफ्टवेयर के लिए इन्वेंटरी और स्कैन इतिहास डाउनलोड करें।',
  excelFormat: 'Excel फॉर्मेट', tallyExport: 'Tally निर्यात',
  totalInventoryValue: 'कुल इन्वेंटरी मूल्य', invoicesScanned: 'स्कैन किए गए इनवॉइस',
  stockIntakeTrend: 'स्टॉक इनटेक ट्रेंड', recentReports: 'हाल की रिपोर्ट',
  managePreferences: 'अपनी ऐप प्राथमिकताएं प्रबंधित करें', preferences: 'प्राथमिकताएं',
  language: 'भाषा', notifications: 'सूचनाएं', lowStockThreshold: 'कम स्टॉक सीमा',
  integrationsExport: 'एकीकरण और निर्यात', tallyExportSettings: 'Tally निर्यात सेटिंग्स', autoBackupCloud: 'क्लाउड पर ऑटो-बैकअप',
  other: 'अन्य', helpSupport: 'सहायता और समर्थन', logOut: 'लॉग आउट',
  notificationsTitle: 'सूचनाएं', noNotifications: 'कोई सूचना नहीं',
  logoutConfirmTitle: 'लॉगआउट पुष्टि', logoutConfirmMsg: 'क्या आप वाकई लॉगआउट करना चाहते हैं?', yes: 'हाँ', no: 'नहीं'
};

const mr: Translations = {
  home: 'होम', inventory: 'यादी', reports: 'अहवाल', settings: 'सेटिंग्ज',
  scanInvoice: 'इनव्हॉइस स्कॅन करा', scanDesc: 'OCR द्वारे तपशील काढा आणि यादी त्वरित सिंक करा.',
  totalItems: 'एकूण वस्तू', lowStockAlerts: 'कमी साठा अलर्ट', lowStockAlertsTitle: 'कमी साठा अलर्ट',
  viewAll: 'सर्व पहा', onlyLeft: 'फक्त {n} शिल्लक', reorder: 'पुन्हा ऑर्डर करा',
  recentActivity: 'अलीकडील क्रियाकलाप', itemsAdded: 'वस्तू जोडल्या', noLowStock: 'कमी साठ्याच्या वस्तू नाहीत', noRecentActivity: 'अलीकडील क्रियाकलाप नाही',
  searchPlaceholder: 'वस्तू, SKU किंवा श्रेणी शोधा...', allItems: 'सर्व वस्तू', lowStock: 'कमी साठा', noProductsFound: 'कोणतेही उत्पादन सापडले नाही', inStock: 'साठ्यात',
  exportData: 'डेटा निर्यात करा', exportDesc: 'तुमच्या अकाउंटिंग सॉफ्टवेअरसाठी यादी आणि स्कॅन इतिहास डाउनलोड करा.',
  excelFormat: 'Excel स्वरूप', tallyExport: 'Tally निर्यात',
  totalInventoryValue: 'एकूण यादी मूल्य', invoicesScanned: 'स्कॅन केलेले इनव्हॉइस',
  stockIntakeTrend: 'साठा सेवन ट्रेंड', recentReports: 'अलीकडील अहवाल',
  managePreferences: 'तुमच्या ॲप प्राधान्यक्रम व्यवस्थापित करा', preferences: 'प्राधान्यक्रम',
  language: 'भाषा', notifications: 'सूचना', lowStockThreshold: 'कमी साठा मर्यादा',
  integrationsExport: 'एकत्रीकरण आणि निर्यात', tallyExportSettings: 'Tally निर्यात सेटिंग्ज', autoBackupCloud: 'क्लाउडवर ऑटो-बॅकअप',
  other: 'इतर', helpSupport: 'मदत आणि समर्थन', logOut: 'लॉग आउट',
  notificationsTitle: 'सूचना', noNotifications: 'कोणत्याही सूचना नाहीत',
  logoutConfirmTitle: 'लॉगआउट पुष्टी', logoutConfirmMsg: 'तुम्हाला खरोखर लॉगआउट करायचे आहे का?', yes: 'होय', no: 'नाही'
};

export const TRANSLATIONS: Record<string, Translations> = { English: en, Hindi: hi, Marathi: mr };

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private _lang = new BehaviorSubject<Translations>(en);
  readonly t$ = this._lang.asObservable();

  constructor() {
    const saved = localStorage.getItem('appLanguage');
    if (saved && TRANSLATIONS[saved]) this._lang.next(TRANSLATIONS[saved]);
  }

  setLanguage(lang: string) {
    if (TRANSLATIONS[lang]) {
      this._lang.next(TRANSLATIONS[lang]);
      localStorage.setItem('appLanguage', lang);
    }
  }

  get current(): Translations {
    return this._lang.value;
  }
}
