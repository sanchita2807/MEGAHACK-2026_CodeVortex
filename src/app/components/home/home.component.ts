import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DashboardService, DashboardStats, Product, Invoice } from '../../services/dashboard.service';
import { ToastService } from '../../services/toast.service';
import { OcrService } from '../../services/ocr.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements OnInit {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  stats: DashboardStats = { totalItems: 0, lowStockAlerts: 0, invoicesScanned: 0, totalInventoryValue: 0 };
  lowStockProducts: Product[] = [];
  recentInvoices: Invoice[] = [];
  shopName = 'My Shop';
  showCamera = false;
  capturedImage: string | null = null;
  stream: MediaStream | null = null;
  isProcessing = false;
  showConfirmation = false;
  extractedData: any = null;
  showRawText = false;
  isEditMode = false;
  newItem = { name: '', quantity: 1, price: 0 };

  constructor(
    private dashboardService: DashboardService,
    private ocrService: OcrService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadDashboardData();
  }

  loadUserData() {
    const shop = localStorage.getItem('shopName');
    if (shop) this.shopName = shop;
  }

  loadDashboardData() {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => {
        console.error('Error loading stats:', err);
        this.toastService.error('Failed to load dashboard stats');
      }
    });

    this.dashboardService.getLowStockProducts().subscribe({
      next: (data) => {
        this.lowStockProducts = data.slice(0, 2);
      },
      error: (err) => {
        console.error('Error loading low stock products:', err);
        this.toastService.error('Failed to load low stock products');
      }
    });

    this.dashboardService.getRecentInvoices().subscribe({
      next: (data) => {
        this.recentInvoices = data.slice(0, 2);
      },
      error: (err) => {
        console.error('Error loading invoices:', err);
        this.toastService.error('Failed to load recent invoices');
      }
    });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  openCamera() {
    this.capturePhoto();
  }

  async capturePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      if (image.dataUrl) {
        this.capturedImage = image.dataUrl;
        this.showCamera = false;
        this.toastService.success('Invoice captured successfully');
      }
    } catch (error) {
      console.error('Camera error:', error);
      this.toastService.error('Failed to capture photo');
    }
  }

  requestCameraPermission() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.toastService.error('Camera API not supported in your browser.');
      this.closeCamera();
      return;
    }

    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'camera' })
        .then((permissionStatus) => {
          console.log('Camera permission status:', permissionStatus.state);
          if (permissionStatus.state === 'denied') {
            this.toastService.error('Camera permission is blocked. Please reset it in browser settings.');
            this.closeCamera();
            return;
          }
          this.startCamera();
        })
        .catch(() => {
          this.startCamera();
        });
    } else {
      this.startCamera();
    }
  }

  startCamera() {
    const constraints = {
      video: {
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        this.stream = stream;
        if (this.videoElement && this.videoElement.nativeElement) {
          this.videoElement.nativeElement.srcObject = stream;
          this.videoElement.nativeElement.play().catch(e => console.error('Play error:', e));
        }
      })
      .catch((err) => {
        console.error('Camera error:', err);
        if (err.name === 'NotAllowedError') {
          this.toastService.error('Camera permission denied. Please allow camera access in browser settings.');
        } else if (err.name === 'NotFoundError') {
          this.toastService.error('No camera device found.');
        } else if (err.name === 'NotReadableError') {
          this.toastService.error('Camera is already in use by another application.');
        } else {
          this.toastService.error('Camera error: ' + err.message);
        }
        this.closeCamera();
      });
  }

  retakePhoto() {
    this.capturedImage = null;
    this.showConfirmation = false;
    this.extractedData = null;
    this.isEditMode = false;
  }

  confirmCapture() {
    if (this.capturedImage) {
      this.isProcessing = true;
      this.toastService.info('Extracting invoice data...');
      
      this.compressImage(this.capturedImage, (compressedImage) => {
        const blob = this.dataUrlToBlob(compressedImage);
        const formData = new FormData();
        formData.append('image', blob, 'invoice.jpg');
        
        this.ocrService.processInvoice(formData).subscribe({
          next: (response) => {
            this.isProcessing = false;
            this.extractedData = response;
            this.showConfirmation = true;
            this.toastService.success('Invoice data extracted successfully');
            console.log('Extracted Data:', response);
          },
          error: (err) => {
            this.isProcessing = false;
            console.error('OCR Error:', err);
            this.toastService.error('Failed to extract invoice data. Please try again.');
          }
        });
      });
    }
  }

  editItem(index: number) {
    if (this.extractedData.items && this.extractedData.items[index]) {
      this.extractedData.items[index].isEditing = true;
    }
  }

  saveItem(index: number) {
    if (this.extractedData.items && this.extractedData.items[index]) {
      const item = this.extractedData.items[index];
      if (!item.name || item.name.trim().length === 0) {
        this.toastService.error('Item name cannot be empty');
        return;
      }
      if (item.quantity <= 0) {
        this.toastService.error('Quantity must be greater than 0');
        return;
      }
      if (item.price < 0) {
        this.toastService.error('Price cannot be negative');
        return;
      }
      item.isEditing = false;
      this.toastService.success('Item updated');
    }
  }

  deleteItem(index: number) {
    if (this.extractedData.items) {
      this.extractedData.items.splice(index, 1);
      this.toastService.success('Item removed');
    }
  }

  addNewItem() {
    if (!this.newItem.name || this.newItem.name.trim().length === 0) {
      this.toastService.error('Item name cannot be empty');
      return;
    }
    if (this.newItem.quantity <= 0) {
      this.toastService.error('Quantity must be greater than 0');
      return;
    }
    if (this.newItem.price < 0) {
      this.toastService.error('Price cannot be negative');
      return;
    }

    if (!this.extractedData.items) {
      this.extractedData.items = [];
    }

    this.extractedData.items.push({
      name: this.newItem.name,
      quantity: this.newItem.quantity,
      price: this.newItem.price,
      isEditing: false
    });

    this.newItem = { name: '', quantity: 1, price: 0 };
    this.toastService.success('Item added successfully');
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.newItem = { name: '', quantity: 1, price: 0 };
    }
  }

  confirmAndAddToInventory() {
    if (this.extractedData) {
      if (this.extractedData.validation && !this.extractedData.validation.isValid) {
        const errors = this.extractedData.validation.errors || [];
        this.toastService.error('Cannot add to inventory: ' + errors[0]);
        return;
      }

      if (!this.extractedData.items || this.extractedData.items.length === 0) {
        this.toastService.error('Please add at least one item');
        return;
      }

      this.toastService.success(`Invoice processed! ${this.extractedData.items.length} items added to inventory`);
      console.log('Invoice confirmed and added:', this.extractedData);
      
      setTimeout(() => {
        this.closeCamera();
        this.loadDashboardData();
      }, 1000);
    }
  }

  cancelConfirmation() {
    this.showConfirmation = false;
    this.extractedData = null;
    this.showRawText = false;
    this.isEditMode = false;
    this.newItem = { name: '', quantity: 1, price: 0 };
  }

  toggleRawText() {
    this.showRawText = !this.showRawText;
  }

  private compressImage(dataUrl: string, callback: (compressedDataUrl: string) => void): void {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      let width = img.width;
      let height = img.height;
      
      const maxWidth = 1200;
      const maxHeight = 1200;
      
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        callback(compressedDataUrl);
      }
    };
  }

  private dataUrlToBlob(dataUrl: string): Blob {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new Blob([u8arr], { type: mime });
  }

  closeCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    this.showCamera = false;
    this.capturedImage = null;
    this.showConfirmation = false;
    this.extractedData = null;
    this.isEditMode = false;
    this.newItem = { name: '', quantity: 1, price: 0 };
  }
}
