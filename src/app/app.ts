import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/toast/toast.component';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('SmartInvoiceFrontend');

  constructor(private toastService: ToastService) { }

  ngOnInit() {
    // Diagnostic toast to ensure the system is visible on load
    this.toastService.success('SmartInvoice System Initialized');
  }
}
