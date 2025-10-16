// Importaciones necesarias para el componente
import { Component, Inject } from '@angular/core'; // Component para definir el componente, Inject para recibir datos externos
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog'; // Para usar modales de Angular Material
import { FormsModule } from '@angular/forms'; // Para usar [(ngModel)] en el HTML
import { CommonModule } from '@angular/common'; // Para directivas como *ngIf y *ngFor
import { MatIconModule } from '@angular/material/icon'; // Para usar <mat-icon> o botones con íconos
import { RouterLink } from '@angular/router'; // Por si se usa navegación dentro del modal

@Component({
  selector: 'app-filtro-modal',
  standalone: true, // Angular moderno: no necesita NgModule
  imports: [
    MatDialogModule,
    CommonModule,
    FormsModule,
    MatIconModule,
    RouterLink,
  ], // Módulos necesarios para el HTML
  templateUrl: './filtro-modal.component.html', // Ruta al HTML del modal
  styleUrl: './filtro-modal.component.scss', // Ruta a los estilos del modal
})
export class FiltroModalComponent {
  //  Estado para mostrar mensaje si no hay resultados
  noResultados: boolean = false;

  //  Variables para guardar los filtros seleccionados
  especie: string = '';
  edad: string | null = null;
  genero: string = '';
  ciudad: string = '';
  size: string = '';
  estadoAdopcion: string = '';
  contexto: string = ''; // Contexto que indica desde qué componente se abrió el modal

  //  Mensajes (aunque no se usan directamente en el HTML)
  mensaje: string = 'NO HAY ANIMALES';
  mensaje1: string = 'mira tus animales';

  //  Opciones para los desplegables
  ciudades: string[] = ['Barcelona', 'Madrid', 'Valencia', 'Sevilla'];
  edades: string[] = ['Cachorro', 'Joven', 'Adulto'];
  estadosAdopcion: string[] = ['Disponible', 'Rechazado', 'Completo'];

  constructor(
    public dialogRef: MatDialogRef<FiltroModalComponent>, // Referencia al modal para poder cerrarlo
    @Inject(MAT_DIALOG_DATA) public data: any // Datos que se pasan al abrir el modal (animales + contexto)
  ) {
    dialogRef.updateSize('100%', '100%'); // Hacemos el modal de pantalla completa
    this.contexto = data.contexto; // Guardamos el contexto recibido (galeria o adopcion)
  }

  //  Funciones para seleccionar filtros desde botones
  selectEspecie(especie: string): void {
    this.especie = especie;
  }

  selectGenero(genero: string): void {
    this.genero = genero;
  }

  selectSize(size: string): void {
    this.size = size;
  }

  selectEstadoAdopcion(estado: string): void {
    this.estadoAdopcion = estado;
  }

  // Aplica los filtros y cierra el modal si hay resultados
  aplicarFiltros(): void {
    console.log('Tipo de datos de this.data:', typeof this.data);
    console.log('Contenido de this.data:', this.data);

    const resultadosFiltrados = this.data.animales.filter((animal: any) => {
      if (this.contexto === 'galeria') {
        return (
          (!this.especie ||
            animal.especie.toLowerCase() === this.especie.toLowerCase()) &&
          (!this.edad ||
            animal.edad.toLowerCase() === this.edad.toLowerCase()) &&
          (!this.genero ||
            animal.genero.toLowerCase() === this.genero.toLowerCase()) &&
          (!this.ciudad ||
            animal.ciudad.toLowerCase() === this.ciudad.toLowerCase()) &&
          (!this.size || animal.size.toLowerCase() === this.size.toLowerCase())
        );
      } else if (this.contexto === 'adopcion') {
        return (
          !this.estadoAdopcion ||
          animal.adoptionState.toLowerCase() ===
            this.estadoAdopcion.toLowerCase()
        );
      }
      return false;
    });

    this.noResultados = resultadosFiltrados.length === 0;

    if (resultadosFiltrados.length > 0) {
      this.dialogRef.close(resultadosFiltrados); // Devuelve los resultados al componente padre
      console.log('hay filtros');
    } else {
      // Si no hay resultados, no se cierra el modal
      console.log('no hay resultados');
    }
  }

  // Reinicia todos los filtros
  borrarFiltros(): void {
    this.especie = '';
    this.edad = null;
    this.genero = '';
    this.ciudad = '';
    this.size = '';
    this.estadoAdopcion = '';
  }

  //  Cierra el modal y devuelve todos los animales si no hay filtros
  cerrarModal(): void {
    this.dialogRef.close(!this.noResultados ? this.data.animales : '');
  }
  // Devuelve el nombre del archivo de imagen según la especie
  getEspecieImg(tipo: string): string {
    const map: any = {
      Perro: 'perrop@3x.png',
      Gato: 'cat@3x.png',
      Tortuga: 'anfibio@3x.png',
      Arácnido: 'group5@3x.png',
      Ave: 'ave@3x.png',
      Reptil: 'group8@3x.png',
    };
    return map[tipo] || 'default.png';
  }

  // Devuelve el nombre del archivo de imagen según el tamaño
  getSizeImg(tam: string): string {
    const map: any = {
      Pequeño: 'group@3x.png',
      Mediano: 'groupCopy@3x.png',
      Grande: 'groupCopy2@3x.png',
    };
    return map[tam] || 'default.png';
  }
}
