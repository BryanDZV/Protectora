import { ApiService } from './../../servicios/api.service';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FiltroModalComponent } from '../../filtros/filtros-modal/filtro-modal.component';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import Animal from '../../../../animal.interface';
import { MatIconModule } from '@angular/material/icon';

import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-galeria',
  standalone: true,

  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    RouterLink,
    NavBarComponent,
    MatIconModule,
  ],

  templateUrl: './galeria.component.html',
  styleUrl: './galeria.component.scss',
})
export class GaleriaComponent {
  public animalesBase = signal<Animal[]>([]); // datos base
  public resultados = signal<Animal[]>([]); // resultados mostrados
  public textoBusqueda = '';

  private readonly apiService = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly favoritosSignal = this.apiService.obtenerAnimalesFavoritos();

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.apiService
      .getAnimales()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((animales) => {
        const favoritos = this.favoritosSignal();
        const conFavorito = animales.map((animal) => ({
          ...animal,
          favorito: favoritos.some((fav) => fav._id === animal._id),
        }));

        this.animalesBase.set(conFavorito);
        this.resultados.set(conFavorito);
      });
  }
  //BUSCADOR
  buscar(texto: string): any {
    const termino = texto.toLowerCase().trim();
    const base = this.animalesBase();
    this.resultados.set(
      termino
        ? base.filter((animal) => animal.nombre.toLowerCase().includes(termino))
        : base,
    );
  }
  //INTERACTUAR CON EL MODAL
  abrirModal(): void {
    //DIALOG.OPEN FUNCIONALIDAD QUE TE DA EL MODAL
    const dialogRef = this.dialog.open(FiltroModalComponent, {
      width: '400px',
      data: { animales: this.animalesBase(), contexto: 'galeria' }, // Pasar todos los animales para aplicar filtros sobre ellos LE PASO A FILTRO MODAL
    });

    // Actualizar la lista de resultados con los filtrados GALERIA RECIBE LOS DATOS YA FILTRADOS DE MODAL
    dialogRef
      .afterClosed()
      .subscribe((animalesFiltrados: Animal[] | undefined) => {
        //afterclose para hacer algo al cerrar el modal en este caso :
        console.log('soy resultadosen galeria', animalesFiltrados);

        if (animalesFiltrados && animalesFiltrados.length > 0) {
          this.resultados.set(animalesFiltrados);
        }
      });
  }

  marcarFavorito(animal: Animal): void {
    const actualmenteFavorito = this.apiService.esAnimalFavorito(animal._id);
    const nuevoEstado = !actualmenteFavorito;

    if (nuevoEstado) {
      this.apiService.agregarAnimalFavorito(animal);
    } else {
      this.apiService.eliminarAnimalFavorito(animal);
    }

    // Reflejar el cambio en las señales locales
    const toggleFavorito = (lista: Animal[]) =>
      lista.map((item) =>
        item._id === animal._id ? { ...item, favorito: nuevoEstado } : item,
      );

    this.resultados.update(toggleFavorito);
    this.animalesBase.update(toggleFavorito);
  }
}
