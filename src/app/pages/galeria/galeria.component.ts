import { ApiService, AnimalFilters } from '../../servicios/api.service';
import { AuthServiceService } from '../../servicios/auth.service.service';
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
import { TranslatePipe } from '@ngx-translate/core';

import { Animal } from '../../types/animal.types';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

const PAGE_SIZE = 12;

@Component({
  selector: 'app-galeria',
  standalone: true,

  imports: [CommonModule, FormsModule, RouterLink, MatIconModule, TranslatePipe],

  templateUrl: './galeria.component.html',
  styleUrl: './galeria.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GaleriaComponent {
  // Datos acumulados (paginación en servidor)
  public animales = signal<Animal[]>([]);
  public loading = signal(false);
  public page = signal(1);
  public totalPages = signal(1);

  // 🔹 Estado de Búsqueda y Filtros
  public inputValue = ''; // Ligado al HTML input
  public textoBusqueda = signal<string>('');
  public filtros = signal<AnimalFilters>({
    especie: '',
    genero: '',
    size: '',
    rangoEdad: '',
  });
  public mostrarFiltros = signal<boolean>(false);

  // Filtrado en cliente: sirve de respaldo mientras se usa la API key demo de
  // RescueGroups (que ignora los filtros del servidor). Con una clave real,
  // el servidor ya filtra y esto simplemente no cambia nada.
  public animalesFiltrados = computed(() => {
    const f = this.filtros();
    const texto = this.textoBusqueda().toLowerCase().trim();

    return this.animales().filter((animal) => {
      if (texto && !animal.nombre.toLowerCase().includes(texto)) return false;
      if (f.especie && animal.especie?.toLowerCase() !== f.especie.toLowerCase())
        return false;
      if (f.genero && animal.genero?.toLowerCase() !== f.genero.toLowerCase())
        return false;
      if (f.size && animal.size?.toLowerCase() !== f.size.toLowerCase())
        return false;
      if (
        f.rangoEdad &&
        animal.rangoEdad?.toLowerCase() !== f.rangoEdad.toLowerCase()
      )
        return false;
      return true;
    });
  });

  private searchTimer?: ReturnType<typeof setTimeout>;

  private readonly apiService = inject(ApiService);
  private readonly authService = inject(AuthServiceService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  // Escuchar el evento de scroll en la pantalla para el "Infinite Scroll"
  @HostListener('window:scroll')
  onScroll(): void {
    if (this.loading() || this.page() >= this.totalPages()) {
      return;
    }

    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= documentHeight - 200) {
      this.cargar(this.page() + 1, false);
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
        this.cargar(1, true);
      });
  }

  // Carga una página (replace = true reinicia la lista)
  cargar(page: number, replace: boolean): void {
    this.loading.set(true);

    this.apiService
      .getAnimalesPage(page, PAGE_SIZE, {
        ...this.filtros(),
        texto: this.textoBusqueda(),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.animales.set(
            replace ? res.data : [...this.animales(), ...res.data],
          );
          this.page.set(res.pagination.currentPage);
          this.totalPages.set(res.pagination.totalPages);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  cargarMas(): void {
    if (!this.loading() && this.page() < this.totalPages()) {
      this.cargar(this.page() + 1, false);
    }
  }

  // Evento cuando se escribe en la barra de búsqueda (con debounce)
  onSearchChange(texto: string): void {
    this.textoBusqueda.set(texto);
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.cargar(1, true), 400);
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
    this.cargar(1, true);
  }

  // Restablecer por completo el panel
  limpiarFiltros(): void {
    this.filtros.set({ especie: '', genero: '', size: '', rangoEdad: '' });
    this.textoBusqueda.set('');
    this.inputValue = '';
    this.cargar(1, true);
  }

  marcarFavorito(animal: Animal): void {
    if (!this.authService.isAuthenticated()) {
      return;
    }

    const nuevoEstado = !animal.isFavorite;

    this.authService.toggleFavorite(animal.id).subscribe(() => {
      this.animales.update((lista) =>
        lista.map((item) =>
          item.id === animal.id ? { ...item, isFavorite: nuevoEstado } : item,
        ),
      );
    });
  }

  estadoAdopcion(animal: Animal): string {
    return animal.localAdoptionStatus || animal.estadoAdopcion || 'Disponible';
  }

  estadoCss(animal: Animal): string {
    return this.estadoAdopcion(animal).toLowerCase();
  }

  puedeAdoptar(animal: Animal): boolean {
    const estado = this.estadoAdopcion(animal).toLowerCase();
    return estado === 'disponible';
  }
}
