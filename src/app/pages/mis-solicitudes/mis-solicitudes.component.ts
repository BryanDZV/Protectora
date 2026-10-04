import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../servicios/api.service';
import { AuthServiceService } from '../../servicios/auth.service.service';
import { Animal } from '../../types/animal.types';
import { AdoptionForm } from '../../types/form.types';

@Component({
  selector: 'app-mis-solicitudes',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, TranslatePipe],
  templateUrl: './mis-solicitudes.component.html',
  styleUrl: './mis-solicitudes.component.scss',
})
export class MisSolicitudesComponent {
  private readonly apiService = inject(ApiService);
  private readonly authService = inject(AuthServiceService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);

  readonly solicitudes = signal<AdoptionForm[]>([]);
  readonly animalesPorId = signal<Record<string, Animal>>({});
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const currentUser = this.authService.currentUserSig();

    if (!currentUser?._id) {
      this.loading.set(false);
      this.error.set(this.translate.instant('REQUESTS.ERROR'));
      return;
    }

    this.apiService
      .getForm()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (forms) => {
          // El backend ya devuelve solo los formularios del usuario.
          this.solicitudes.set(forms);

          const ids = [
            ...new Set(
              forms.map((form) => form.animalExternalId).filter(Boolean),
            ),
          ];

          if (ids.length === 0) {
            this.loading.set(false);
            return;
          }

          forkJoin(ids.map((id) => this.apiService.getAnimalById(id)))
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: (animales) => {
                this.animalesPorId.set(
                  animales.reduce<Record<string, Animal>>(
                    (accumulator, animal) => {
                      accumulator[animal.id] = animal;
                      return accumulator;
                    },
                    {},
                  ),
                );
                this.loading.set(false);
              },
              error: () => this.loading.set(false),
            });
        },
        error: () => {
          this.error.set(this.translate.instant('REQUESTS.ERROR'));
          this.loading.set(false);
        },
      });
  }

  estadoSolicitud(form: AdoptionForm): string {
    const animal = this.animalesPorId()[form.animalExternalId];
    return (
      animal?.localAdoptionStatus ||
      animal?.estadoAdopcion ||
      this.translate.instant('REQUESTS.STATUS_REVIEW')
    );
  }

  estadoCss(form: AdoptionForm): string {
    return this.estadoSolicitud(form)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');
  }

  animalNombre(form: AdoptionForm): string {
    return this.animalesPorId()[form.animalExternalId]?.nombre || 'Animal';
  }

  animalFoto(form: AdoptionForm): string {
    return this.animalesPorId()[form.animalExternalId]?.foto || '';
  }

  ultimaActualizacion(form: AdoptionForm): string {
    return form.updatedAt || form.createdAt || '';
  }
}
