import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OcrService } from '../../services/ocr.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-camera-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camera-modal.component.html',
  styleUrls: ['./camera-modal.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CameraModalComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  isOpen = false;
  isCameraActive = false;
  capturedImage: string | null = null;
  stream: MediaStream | null = null;
  isProcessing = false;

  constructor(
    private ocrService: OcrService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.openCamera();
  }

  ngOnDestroy() {
    this.stopCamera();
  }

  openCamera() {
    this.isOpen = true;
    setTimeout(() => this.startCamera(), 100);
  }

  startCamera() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        this.stream = stream;
        if (this.videoElement) {
          this.videoElement.nativeElement.srcObject = stream;
          this.isCameraActive = true;
        }
      })
      .catch((err) => {
        console.error('Error accessing camera:', err);
        alert('Unable to access camera. Please check permissions.');
      });
  }

  capturePhoto() {
    if (this.videoElement && this.canvasElement) {
      const video = this.videoElement.nativeElement;
      const canvas = this.canvasElement.nativeElement;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (context) {
        context.drawImage(video, 0, 0);
        this.capturedImage = canvas.toDataURL('image/jpeg');
      }
    }
  }

  retakePhoto() {
    this.capturedImage = null;
  }

  confirmCapture() {
    if (this.capturedImage) {
      this.isProcessing = true;
      this.toastService.info('Processing invoice...');
      
      this.compressImage(this.capturedImage, (compressedImage) => {
        const blob = this.dataUrlToBlob(compressedImage);
        const formData = new FormData();
        formData.append('image', blob, 'invoice.jpg');
        
        this.ocrService.processInvoice(formData).subscribe({
          next: (response) => {
            this.isProcessing = false;
            this.toastService.success(`Invoice processed! ${response.itemsAdded} items added to inventory`);
            console.log('OCR Response:', response);
            this.closeModal();
          },
          error: (err) => {
            this.isProcessing = false;
            console.error('OCR Error:', err);
            this.toastService.error('Failed to process invoice. Please try again.');
          }
        });
      });
    }
  }

  private compressImage(dataUrl: string, callback: (compressedDataUrl: string) => void): void {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      let width = img.width;
      let height = img.height;
      
      // Resize if image is too large
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
        // Compress with quality 0.7
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

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.isCameraActive = false;
    }
  }

  closeModal() {
    this.stopCamera();
    this.isOpen = false;
  }
}
