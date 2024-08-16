import { ApiService } from './../../servicios/api.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { FiltroModalComponent } from '../../filtros/filtros-modal/filtro-modal.component';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import Animal from '../../../../animal.interface';
import { MatIconModule } from '@angular/material/icon';


import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';


@Component({
  selector: 'app-galeria',
  standalone: true,


  imports: [
    CommonModule,
    MatDialogModule,
    FiltroModalComponent,
    FormsModule,
    RouterLink,
    NavBarComponent,
    MatIconModule,
  ],

  templateUrl: './galeria.component.html',
  styleUrl: './galeria.component.scss',
})
export class GaleriaComponent {
  public animalesBase: any[] = []; //para guardar mis datos base
  public resultados: any[] = []; //lo uso para el resultado el buscador guardar sus resutlados o mostrar los animales base
  public textoBusqueda = ''; //inicar el buscador con 0


  constructor(private apiService: ApiService, private dialog: MatDialog) {}


  ngOnInit(): void {
    this.apiService.getAnimales().subscribe((data: any) => {

      console.log("soy data en galeria",data);
      this.resultados = data;
      this.animalesBase=this.resultados


      // Recuperar los animales favoritos y actualizar el estado de favorito en la galería
      const animalesFavoritos = this.apiService.obtenerAnimalesFavoritos();
      this.resultados.forEach(animal => {
        animal.favorito = animalesFavoritos.some(favorito => favorito._id === animal._id);
      });
    });
  }
  //BUSCADOR
  buscar(texto: string): any {
    this.resultados = this.animalesBase.filter((animal) =>
      animal.nombre.toLowerCase().includes(texto.toLowerCase())
    );
  }
  //INTERACTUAR CON EL MODAL
  abrirModal(): void {
    //DIALOG.OPEN FUNCIONALIDAD QUE TE DA EL MODAL
    const dialogRef = this.dialog.open(FiltroModalComponent, {
      width: '400px',
      data: { animales: this.animalesBase, contexto: 'galeria' }, // Pasar todos los animales para aplicar filtros sobre ellos LE PASO A FILTRO MODAL
    });

    // Actualizar la lista de resultados con los filtrados GALERIA RECIBE LOS DATOS YA FILTRADOS DE MODAL
    dialogRef.afterClosed().subscribe((resultados: any[]) => {
      //afterclose para hacer algo al cerrar el modal en este caso :
      console.log('soy resultadosen galeria', resultados);

      if (resultados && resultados.length > 0) {
        this.resultados = resultados;
      }
    });
  }


  marcarFavorito(animal: Animal): void {


    animal.favorito = !animal.favorito;
    if (animal.favorito) {
      console.log("estas marcado animal");
      this.apiService.agregarAnimalFavorito(animal);
    } else {
      this.apiService.eliminarAnimalFavorito(animal);
      console.log("estas quitando animal");
    }
  }

}
