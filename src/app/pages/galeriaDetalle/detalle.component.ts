import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map, switchMap } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Animal } from '../../types/animal.types';
import { ApiService } from '../../servicios/api.service';
import { AuthServiceService } from '../../servicios/auth.service.service';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    TranslatePipe,
  ],
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.scss',
})
export class DetalleComponent {
  private readonly servicio = inject(ApiService);
  private readonly authService = inject(AuthServiceService);
  private readonly translate = inject(TranslateService);
  private readonly rutaActivada = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  readonly animal = signal<Animal | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly actionMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.rutaActivada.paramMap
      .pipe(
        map((params) => params.get('id')),
        filter((id): id is string => !!id),
        switchMap((id) => {
          this.loading.set(true);
          return this.servicio.getAnimalById(id);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (animal) => {
          this.animal.set(animal);
          this.loading.set(false);
        },
        error: () => {
          this.error.set(this.translate.instant('DETAIL.ERROR'));
          this.loading.set(false);
        },
      });
  }

  esFavorito(): boolean {
    return this.animal()?.isFavorite ?? false;
  }

  estadoAdopcion(): string {
    const animal = this.animal();
    return animal?.localAdoptionStatus || animal?.estadoAdopcion || 'Disponible';
  }

  puedeAdoptar(): boolean {
    return this.estadoAdopcion().toLowerCase() === 'disponible';
  }

  handleShareClick(): void {
    const animal = this.animal();

    if (!animal) {
      return;
    }

    const shareUrl = this.router.serializeUrl(
      this.router.createUrlTree(['/home/galeria', animal.id]),
    );

    if (navigator.share) {
      navigator.share({
        title: animal.nombre,
        text: `${this.translate.instant('DETAIL.SHARE_TITLE')} ${animal.nombre}`,
        url: shareUrl,
      });
    }

    this.actionMessage.set(this.translate.instant('DETAIL.SHARE_READY'));
  }

  handleLikeClick(): void {
    const animal = this.animal();

    if (!animal) {
      return;
    }

    if (!this.authService.isAuthenticated()) {
      this.actionMessage.set(
        this.translate.instant('DETAIL.LOGIN_FOR_FAVORITES'),
      );
      return;
    }

    this.authService.toggleFavorite(animal.id).subscribe(() => {
      this.animal.update((current) =>
        current ? { ...current, isFavorite: !current.isFavorite } : current,
      );
      this.actionMessage.set(
        this.translate.instant(
          this.esFavorito() ? 'DETAIL.FAVORITE_ADDED' : 'DETAIL.FAVORITE_REMOVED',
        ),
      );
    });
  }

  abrirVentanaEmergente(): void {
    const animal = this.animal();

    if (!animal || !this.puedeAdoptar()) {
      return;
    }

    localStorage.setItem('selectedAnimalId', animal.id);
    this.router.navigate(['/home/adopcion', animal.id]);
  }

  iniciarFormulario(): void {
    const animal = this.animal();

    if (!animal || !this.puedeAdoptar()) {
      return;
    }

    localStorage.setItem('selectedAnimalId', animal.id);
    this.router.navigate(['/home/adopcion', animal.id]);
  }
}
