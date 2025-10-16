import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-adopcion-modal',
  standalone: true,
  imports: [],
  templateUrl: './adopcion-modal.component.html',
  styleUrl: './adopcion-modal.component.scss',
})
export class AdopcionModalComponent {
  // Inyecto el modal para poder cerrarlo desde dentro
  constructor(public dialogRef: MatDialogRef<AdopcionModalComponent>) {}

  // Función que cierra el modal
  cerrarVentana() {
    this.dialogRef.close();
  }
}
