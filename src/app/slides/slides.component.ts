import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SlideData } from '../types/slide.types';

@Component({
  selector: 'app-slides',
  standalone: true,
  imports: [CommonModule, MatIconModule],
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
      title: 'Encuentra todo tipo de servicios cerca de ti',
    },
    {
      img: '../../assets/onboarding/imagen2@3x.png',
      title: 'Adopta desde tu móvil',
      text: 'Puedes acceder al perfil de muchos animales en adopción y filtrarlos para encontrar el que mejor se adapte a ti',
    },
    {
      img: '../../assets/onboarding/undrawPetAdoption2Qkw@3x.png',
      title:
        'Si eres una asociación, sube a tus peludos para darles más difusión',
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
