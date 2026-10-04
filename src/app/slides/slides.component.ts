import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { SlideData } from '../types/slide.types';

@Component({
  selector: 'app-slides',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslatePipe],
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.scss'],
})
export class SlidesComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  currentId = 1;

  slides: SlideData[] = [
    {
      img: '../../assets/onboarding/undrawGoodDoggy4Wfq@3x.png',
      title: 'ONBOARDING.SLIDE1_TITLE',
    },
    {
      img: '../../assets/onboarding/imagen2@3x.png',
      title: 'ONBOARDING.SLIDE2_TITLE',
      text: 'ONBOARDING.SLIDE2_TEXT',
    },
    {
      img: '../../assets/onboarding/undrawPetAdoption2Qkw@3x.png',
      title: 'ONBOARDING.SLIDE3_TITLE',
    },
  ];

  slide!: SlideData;

  constructor() {
    this.route.params.subscribe((p) => {
      this.currentId = Number(p['id']);
      this.slide = this.slides[this.currentId - 1];
    });
  }

  irSiguiente(): void {
    if (this.currentId === 3) {
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/slide', this.currentId + 1]);
  }

  irAnterior(): void {
    const prev = this.currentId === 1 ? 1 : this.currentId - 1;
    this.router.navigate(['/slide', prev]);
  }

  omitir(): void {
    this.router.navigate(['/login']);
  }
}
