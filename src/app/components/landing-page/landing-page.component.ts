import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, ButtonModule, RippleModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  animations: [
    trigger('pageAnimations', [
      transition(':enter', [
        query('.hero-content, .action-card', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('0.5s cubic-bezier(0.35, 0, 0.25, 1)',
              style({ opacity: 1, transform: 'none' }))
          ])
        ])
      ])
    ]),
    trigger('cardHover', [
      transition(':enter', []),
      transition('* => hover', [
        style({ transform: 'scale(1)' }),
        animate('0.3s ease', style({ transform: 'scale(1.03)' }))
      ]),
      transition('hover => *', [
        animate('0.2s ease', style({ transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class LandingPageComponent {
  constructor(private router: Router) { }

  navigateTo(route: string) {
    // Add ripple effect before navigation
    setTimeout(() => {
      this.router.navigate([route]);
    }, 300);
  }

  cardState = 'initial';

  onCardHover(state: 'hover' | 'initial') {
    this.cardState = state;
  }
}