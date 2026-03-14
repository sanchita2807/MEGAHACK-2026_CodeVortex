import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
    message: string;
    type: 'success' | 'error' | 'info';
    id: number;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private toastSubject = new Subject<Toast>();
    toasts$ = this.toastSubject.asObservable();
    private counter = 0;

    show(message: string, type: 'success' | 'error' | 'info' = 'success') {
        this.toastSubject.next({ message, type, id: this.counter++ });
    }

    success(message: string) {
        this.show(message, 'success');
    }

    error(message: string) {
        this.show(message, 'error');
    }

    info(message: string) {
        this.show(message, 'info');
    }
}
