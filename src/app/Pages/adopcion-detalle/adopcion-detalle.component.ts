import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';

import { ApiService } from '../../servicios/api.service';
import { AdopcionModalComponent } from '../../filtros/adopcion-modal/adopcion-modal.component';

@Component({
  selector: 'app-adopcion-detalle',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatTabsModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './adopcion-detalle.component.html',
  styleUrl: './adopcion-detalle.component.scss',
})
export class AdopcionDetalleComponent {
  id!: string;
  animalEstado!: any;

  // 📷 Fotos seleccionadas
  fotoSeleccionada1!: File;
  fotoSeleccionada2!: File;
  fotoSeleccionada3!: File;

  // 🧾 Datos del formulario
  seleccionarOpcion!: string;
  opciones: string[] = ['iva:90 $', 'vacuna:20$', 'gestión:15$'];
  checkedvisto1 = false;
  checkedvisto2 = false;

  // 🕒 Fecha y hora
  fechaSeleccionada!: Date;
  inputText!: string;

  constructor(
    private servicio: ApiService,
    private rutaActivada: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.rutaActivada.paramMap.subscribe((params) => {
      this.id = params.get('id')!;
      this.servicio.getAnimalbyId(this.id).subscribe((data) => {
        this.animalEstado = data;
      });
    });
  }

  seleccionarFoto1(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fotoSeleccionada1 = input.files?.[0]!;
  }

  seleccionarFoto2(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fotoSeleccionada2 = input.files?.[0]!;
  }

  seleccionarFoto3(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fotoSeleccionada3 = input.files?.[0]!;
  }

  subir(): void {
    const data = {
      foto1: this.fotoSeleccionada1,
      foto2: this.fotoSeleccionada2,
      foto3: this.fotoSeleccionada3,
      opcion: this.seleccionarOpcion,
      visto1: this.checkedvisto1,
      visto2: this.checkedvisto2,
    };

    this.servicio.enviarDatos(data).subscribe({
      error: (error) => {
        console.error('No se ha enviado datos desde adopcion-Modal:', error);
      },
    });
  }

  abrirModal(): void {
    this.dialog.open(AdopcionModalComponent, {
      width: '50%',
      data: {},
    });
  }
}
