import { Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { FormsModule,} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-filtro-modal',
  standalone: true,
  imports: [MatDialogModule,CommonModule,FormsModule,MatIconModule,RouterLink],
  templateUrl:'./filtro-modal.component.html',
  styleUrl: './filtro-modal.component.scss'
})
export class FiltroModalComponent {
  // PARA GUARDAR SINO HAY FILTROS
noResultados: boolean = false;

especieSeleccionada: string = ''
    // variables que me creo para guardar  los filtros que se seleccione
    especie: string = '';
    edad: string | null = null;
    genero: string = '';
    ciudad: string = '';
    size: string = '';
    nombre: string = '';
    estadoAdopcion: string = '';
    contexto: string = ''; // Variable para el contexto=== al componente que quiero usar en el modal FUNCION QUE TE DA EL MODAL PARA PASAR INFORMACION
    mensaje:string="NO HAY ANIMALES" //PARA MANDAR MENSAJE
    mensaje1:string="mira tus animales"
    // resultadosFiltrados!:any

    // Definir arrays de opciones para los selects y iterar y tener el desplegable
    ciudades: string[] = ['Barcelona', 'Madrid', 'Valencia','Sevilla'];

    edades: string[] = ['Cachorro', 'Joven', 'Adulto'];
    estadosAdopcion: string[] = ['Disponible', 'Rechazado', 'Completo'];

    constructor(
      //aqui importo el modal CON MATDIALORef se utiliza para interactuar con el modal desde el componente. Puedes cerrar el modal, obtener
      //información sobre él, etc.ademas con@inject puedo pasar datos en el modal en funcion del contexto
      //que me viene de galeria componente
      public dialogRef: MatDialogRef<FiltroModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
      //es un decorador para inyectar los datos que se pasan al modal desde el componente
      //que lo abre==GAleria en mi caso. MAT_DIALOG_DATA
      //decoradores en Angular incluyen @Component, @Injectable, @NgModule, @Input, @Output
    ) {
      //puedo cambiar el tamaño del modal
      dialogRef.updateSize('100%', '100%');

      this.contexto = data.contexto; // paso los datos del valor del contexto recibido
      //guardo los animales aqui para usar
    }
//FUNCIONES PARA CONTRROLAR las SELECCIONES
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


  // Método para aplicar los filtros y cerrar el modal con los resultados
  aplicarFiltros(): void {
    //no sabia que datos era no me llegaba
    console.log('Tipo de datos de this.data:', typeof this.data);
console.log('Contenido de this.data:', this.data);

    // para filtrar los datos según el CONTEXTOEN FUNCION DE EL ME FILTRA 1 U OTROS
    const resultadosFiltrados = this.data.animales.filter((animal: any) => {
      if (this.contexto === 'galeria') {
        // Filtrar según los filtros de la gaLERIA
        return (!this.especie || animal.especie.toLowerCase() === this.especie.toLowerCase()) &&
               (!this.edad || animal.edad.toLowerCase() === this.edad.toLowerCase()) &&
               (!this.genero || animal.genero.toLowerCase() === this.genero.toLowerCase()) &&
               (!this.ciudad || animal.ciudad.toLowerCase() === this.ciudad.toLowerCase()) &&
               (!this.size || animal.size.toLowerCase() === this.size.toLowerCase());
      } else if (this.contexto === 'adopcion') {
        // según el filtro de aDOPCION
        return !this.estadoAdopcion || animal.adoptionState.toLowerCase() === this.estadoAdopcion.toLowerCase();
      }
      return false; // siempre debo traer todas las sRUTAS POSIBLES Y DARLES VALOR
    });

    // visibilidad del mensaje sI no hay animal
    this.noResultados = resultadosFiltrados.length == 0;

    // DESPUES DE APLICAR FILTRO --->Cierra el modal y devuelve los resultados filtrados si hay resultados
    if (resultadosFiltrados.length > 0) {
      //USO EL CLOSE DEL MODAL
      this.dialogRef.close(resultadosFiltrados);
      this.mensaje1
      console.log("hay filtros");

    } else {
      this.mensaje
      // Si no hay resultados QUIERO Q ME muestra el mensaje NO ANIMALES

    }



}

///FUNCION PARA CERRAR Y BORRAR FILTROS
  borrarFiltros(): void {
    // Reiniciar todas las propiedades de filtro
    this.especie = '';
    this.edad = null;
    this.genero = '';
    this.ciudad = '';
    this.size = '';
    this.estadoAdopcion = '';



  }

  cerrarModal(): void {
    // EL BOTON CERRAR DENTRO DE MODAL Cierra el modal y devuelve todos los animales si no hay resultados
    this.dialogRef.close(!this.noResultados ? this.data.animales : "");
  }



}







