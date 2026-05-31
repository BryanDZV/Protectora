import { ApiService } from '../../servicios/api.service';
import {
  Component,
  DestroyRef,
  inject,
  signal,
  computed,
  HostListener,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Animal } from '../../types/animal.types';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-galeria',
  standalone: true,

  imports: [CommonModule, FormsModule, RouterLink, MatIconModule],

  templateUrl: './galeria.component.html',
  styleUrl: './galeria.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GaleriaComponent {
  public animalesBase = signal<Animal[]>([]); // datos base

  // 🔹 Estado de Búsqueda y Filtros
  public inputValue = ''; // Ligado al HTML input
  public textoBusqueda = signal<string>('');
  public filtros = signal({ especie: '', genero: '', size: '', rangoEdad: '' });
  public mostrarFiltros = signal<boolean>(false);

  // 🔹 Paginación (Scroll Infinito)
  public itemsToShow = signal<number>(12);

  // 🪄 MAGIA UX: Computado que reacciona instantáneamente a cualquier filtro o búsqueda
  public resultadosFiltrados = computed(() => {
    let lista = this.animalesBase();
    const busqueda = this.textoBusqueda().toLowerCase().trim();
    const f = this.filtros();

    if (busqueda) {
      lista = lista.filter((a) => a.nombre.toLowerCase().includes(busqueda));
    }
    if (f.especie)
      lista = lista.filter(
        (a) => a.especie?.toLowerCase() === f.especie.toLowerCase(),
      );
    if (f.genero)
      lista = lista.filter(
        (a) => a.genero?.toLowerCase() === f.genero.toLowerCase(),
      );
    if (f.size)
      lista = lista.filter(
        (a) => a.size?.toLowerCase() === f.size.toLowerCase(),
      );
    if (f.rangoEdad)
      lista = lista.filter(
        (a) => a.rangoEdad?.toLowerCase() === f.rangoEdad.toLowerCase(),
      );

    return lista;
  });

  // 🪄 SCROLL INFINITO: Extrae solo los elementos hasta el límite visible
  public animalesMostrados = computed(() => {
    return this.resultadosFiltrados().slice(0, this.itemsToShow());
  });

  private readonly apiService = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly favoritosSignal = this.apiService.obtenerAnimalesFavoritos();

  // Escuchar el evento de scroll en la pantalla para el "Infinite Scroll"
  @HostListener('window:scroll')
  onScroll(): void {
    if (this.itemsToShow() >= this.resultadosFiltrados().length) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;

    // Si el usuario llega a 150px del fondo de la página, carga 8 animales más
    if (scrollPosition >= documentHeight - 150) {
      this.itemsToShow.update((val) => val + 8);
    }
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((qp) => {
        if (qp['q']) {
          this.inputValue = qp['q'];
          this.textoBusqueda.set(qp['q']);
        }
      });

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
      });
  }

  // Evento cuando se escribe en la barra de búsqueda
  onSearchChange(texto: string): void {
    this.textoBusqueda.set(texto);
    this.itemsToShow.set(12); // Reinicia el scroll infinito
  }

  // Alternar la selección de un filtro en los Chips UI
  toggleFiltro(
    tipo: 'especie' | 'genero' | 'size' | 'rangoEdad',
    valor: string,
  ): void {
    const f = this.filtros();
    this.filtros.set({
      ...f,
      // Si haces clic en un filtro ya seleccionado, se deselecciona (toggle)
      [tipo]: f[tipo] === valor ? '' : valor,
    });
    this.itemsToShow.set(12); // Reinicia el scroll infinito
  }

  // Restablecer por completo el panel
  limpiarFiltros(): void {
    this.filtros.set({ especie: '', genero: '', size: '', rangoEdad: '' });
    this.textoBusqueda.set('');
    this.inputValue = '';
    this.itemsToShow.set(12);
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

    // Solo es necesario actualizar la base; los signals computados se refrescarán solitos
    this.animalesBase.update(toggleFavorito);
  }

  estadoAdopcion(animal: Animal): string {
    return animal.estadoAdopcion || animal.adoptionState || 'Disponible';
  }

  estadoCss(animal: Animal): string {
    return this.estadoAdopcion(animal).toLowerCase();
  }

  puedeAdoptar(animal: Animal): boolean {
    const estado = this.estadoAdopcion(animal).toLowerCase();
    return estado === 'disponible';
  }
}
