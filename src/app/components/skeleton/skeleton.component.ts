import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="skeleton" [ngClass]="type" [ngStyle]="{'width': width, 'height': height}"></div>`,
  styles: [`
    .skeleton {
      background: linear-gradient(90deg, #e2eaf4 25%, #cdd8ec 50%, #e2eaf4 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 8px;
    }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    .skeleton.circle { border-radius: 50%; }
    .skeleton.text { height: 16px; border-radius: 4px; }
    .skeleton.card { border-radius: 12px; }
  `]
})
export class SkeletonComponent {
  @Input() width: string = '100%';
  @Input() height: string = '20px';
  @Input() type: 'default' | 'circle' | 'text' | 'card' = 'default';
}
