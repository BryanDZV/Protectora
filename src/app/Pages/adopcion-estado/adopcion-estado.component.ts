import { ApiService } from '../../servicios/api.service';
import { Component } from '@angular/core';
import { FiltroModalComponent } from '../../filtros/filtros-modal/filtro-modal.component';
import { CommonModule } from '@angular/common';
import {MatDialog, MatDialogModule,} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-adopcion-estado',
  standalone: true,
  imports: [CommonModule,MatDialogModule,FiltroModalComponent,FormsModule,RouterLink,MatIconModule],
  templateUrl: './adopcion-estado.component.html',
  styleUrl: './adopcion-estado.component.scss'
})
export class AdopcionEstadoComponent {
  public animalesBase: any[] = [];
  public resultados: any[] = [];
  public textoBusqueda = '';

  constructor(private apiService: ApiService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.apiService.getAnimales().subscribe((data: any) => {
      this.animalesBase = data;
      this.resultados = this.animalesBase; // Inicialmente muestra todos los animales
    });
  }

  buscar(texto: string): any {
    this.resultados = this.animalesBase.filter(animal =>
      animal.nombre.toLowerCase().includes(texto.toLowerCase())
    );
  }

  abrirModal(): void {
    const dialogRef = this.dialog.open(FiltroModalComponent, {
      width: '400px',
      data: { animales: this.animalesBase, contexto: 'adopcion' }
    });

    dialogRef.afterClosed().subscribe((resultados: any[]) => {
      if (resultados && resultados.length > 0) {
        this.resultados = resultados;
      }
    });
  }

}

