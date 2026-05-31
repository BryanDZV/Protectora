import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map, switchMap } from 'rxjs';
import { Animal } from '../../types/animal.types';
import { ApiService } from '../../servicios/api.service';

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
  ],
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.scss',
})
export class DetalleComponent {
  private readonly servicio = inject(ApiService);
  private readonly rutaActivada = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  readonly animal = signal<Animal | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly actionMessage = signal<string | null>(null);
  private id = '';

  ngOnInit(): void {
    this.rutaActivada.paramMap
      .pipe(
        map((params) => params.get('id')),
        filter((id): id is string => !!id),
        switchMap((id) => {
          this.id = id;
          this.loading.set(true);
          return this.servicio.getAnimalbyId(id);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (animal) => {
          this.animal.set(animal);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se ha podido cargar la ficha del animal.');
          this.loading.set(false);
        },
      });
  }

  esFavorito(): boolean {
    return this.id ? this.servicio.esAnimalFavorito(this.id) : false;
  }

  estadoAdopcion(): string {
    const animal = this.animal();
    return animal?.estadoAdopcion || animal?.adoptionState || 'Disponible';
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
      this.router.createUrlTree(['/home/gallery', animal._id]),
    );

    if (navigator.share) {
      navigator.share({
        title: animal.nombre,
        text: `Ficha de ${animal.nombre}`,
        url: shareUrl,
      });
    }

    this.actionMessage.set('Ficha lista para compartir.');
  }

  handleLikeClick(): void {
    const animal = this.animal();

    if (!animal) {
      return;
    }

    if (this.esFavorito()) {
      this.servicio.eliminarAnimalFavorito(animal);
      this.actionMessage.set('Se ha quitado de favoritos.');
      return;
    }

    this.servicio.agregarAnimalFavorito(animal);
    this.actionMessage.set('Se ha añadido a favoritos.');
  }

  abrirVentanaEmergente(): void {
    const animal = this.animal();

    if (!animal || !this.puedeAdoptar()) {
      return;
    }

    localStorage.setItem('selectedAnimalId', animal._id);
    this.router.navigate(['/home/adopcion', animal._id]);
  }

  iniciarFormulario(): void {
    const animal = this.animal();

    if (!animal || !this.puedeAdoptar()) {
      return;
    }

    localStorage.setItem('selectedAnimalId', animal._id);
    this.router.navigate(['/home/formAd']);
  }
}
