import { Component, OnDestroy, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast, ToastService } from '../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.css'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ToastComponent implements OnInit, OnDestroy {
    toasts: Toast[] = [];
    private subscription?: Subscription;

    constructor(private toastService: ToastService) { }

    ngOnInit() {
        this.subscription = this.toastService.toasts$.subscribe(toast => {
            this.toasts.push(toast);
            setTimeout(() => this.remove(toast.id), 5000);
        });
    }

    remove(id: number) {
        this.toasts = this.toasts.filter(t => t.id !== id);
    }

    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }
}
