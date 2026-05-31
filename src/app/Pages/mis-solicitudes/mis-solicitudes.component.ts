import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../servicios/api.service';
import { AuthServiceService } from '../../servicios/auth.service.service';
import { Animal } from '../../types/animal.types';
import { AdoptionForm } from '../../types/form.types';

@Component({
  selector: 'app-mis-solicitudes',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './mis-solicitudes.component.html',
  styleUrl: './mis-solicitudes.component.scss',
})
export class MisSolicitudesComponent {
  private readonly apiService = inject(ApiService);
  private readonly authService = inject(AuthServiceService);
  private readonly destroyRef = inject(DestroyRef);

  readonly solicitudes = signal<AdoptionForm[]>([]);
  readonly animalesPorId = signal<Record<string, Animal>>({});
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const currentUser = this.authService.currentUserSig();

    if (!currentUser?._id) {
      this.loading.set(false);
      this.error.set('No se ha podido identificar tu usuario.');
      return;
    }

    forkJoin({
      forms: this.apiService.getForm(),
      animales: this.apiService.getAnimales(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ forms, animales }) => {
          this.solicitudes.set(
            forms.filter((form) => form.user_id === currentUser._id),
          );

          this.animalesPorId.set(
            animales.reduce<Record<string, Animal>>((accumulator, animal) => {
              accumulator[animal._id] = animal;
              return accumulator;
            }, {}),
          );

          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se han podido cargar tus solicitudes.');
          this.loading.set(false);
        },
      });
  }

  estadoSolicitud(form: AdoptionForm): string {
    const animal = this.animalesPorId()[form.animal_id];
    return animal?.estadoAdopcion || animal?.adoptionState || 'En revisión';
  }

  estadoCss(form: AdoptionForm): string {
    return this.estadoSolicitud(form)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');
  }

  animalNombre(form: AdoptionForm): string {
    return this.animalesPorId()[form.animal_id]?.nombre || 'Animal';
  }

  animalFoto(form: AdoptionForm): string {
    return (
      this.animalesPorId()[form.animal_id]?.foto ||
      'assets/placeholder/david11.jpg'
    );
  }

  ultimaActualizacion(form: AdoptionForm): string {
    const animal = this.animalesPorId()[form.animal_id];
    return animal?.updatedAt || animal?.createdAt || '';
  }
}
