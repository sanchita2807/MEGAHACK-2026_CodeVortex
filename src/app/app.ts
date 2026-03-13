import { Component, signal, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/toast/toast.component';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class App implements OnInit {
  protected readonly title = signal('SmartInvoiceFrontend');

  constructor(private toastService: ToastService) { }

  ngOnInit() {
    // Diagnostic toast to ensure the system is visible on load
    this.toastService.success('SmartInvoice System Initialized');
  }
}
