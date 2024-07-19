import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon'
import { ApiService } from '../../servicios/api.service';

import { ActivatedRoute, RouterLink } from '@angular/router';

import { PopUpComponent } from '../../pop-up/pop-up.component';
import {MatDialog, MatDialogModule,} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [MatTabsModule, MatIconModule, PopUpComponent, FormsModule, CommonModule,RouterLink],
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.scss'
})
export class DetalleComponent {
  id!:any;
  animals!:any;
  constructor(private servicio: ApiService, private rutaActivada: ActivatedRoute, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.rutaActivada.paramMap.subscribe(params => {
      //console.log(params);
           this.id = params.get("id")
     console.log("Soy Id",params.get("id"));
    })

    this.servicio.getAnimalbyId(this.id).subscribe((data:any)=>{
      console.log("Soy datos",data);
      this.animals=data
    })
  }

  handleShareClick() {
    if (navigator.share) {
      navigator.share({
        title: 'Título de la información compartida',
        text: 'Texto descriptivo de la información compartida',
        url: 'URL de la información compartida',
      })
        .then(() => console.log('Información compartida con éxito'))
        .catch((error) => console.error('Error al intentar compartir:', error));
    } else {
      console.log('La API de Web Share no está disponible en este navegador.');
    }
  }

  handleLikeClick() {
    // Lógica para manejar el clic en el botón "Me gusta"
    console.log('¡Me gusta!');
    // Puedes agregar aquí la lógica adicional, como enviar una solicitud al servidor, actualizar la interfaz de usuario, etc.
  }

  abrirVentanaEmergente(): void {
    const dialogRef = this.dialog.open(PopUpComponent, {
      width: '400px',
      data:{animales: this.abrirVentanaEmergente, contexto: 'galeria'}
    });
  }

  info: boolean = false;
  openInfo() {
    this.info = true;
  }
  closeInfo() {
    this.info = false;
  }
  
  boolToWord(bool: boolean): string {
    return bool ? 'Si' : 'No';
  }

}

