import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../servicios/api.service';
import { AuthServiceService } from '../../servicios/auth.service.service';
import { Animal } from '../../types/animal.types';
import { AdoptionForm, AdoptionFormInput } from '../../types/form.types';

@Component({
  selector: 'app-adopcion-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, FormsModule, TranslatePipe],
  templateUrl: './adopcion-detalle.component.html',
  styleUrl: './adopcion-detalle.component.scss',
})
export class AdopcionDetalleComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly authService = inject(AuthServiceService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);

  public animal = signal<Animal | null>(null);
  public adoptionStatus = signal<string>('Disponible');
  public statusMessage = signal<string | null>(null);
  public isSubmitting = signal(false);

  // 🔹 UX: Controlamos en qué paso estamos (1: Ficha, 2: Formulario, 3: Éxito)
  public currentStep = signal<number>(1);

  // 🔹 UX: Solicitud existente del usuario para el Dashboard de seguimiento
  public existingRequest = signal<AdoptionForm | null>(null);

  // 🔹 Datos reactivos del formulario
  public formData = {
    telf: '',
    dni: '',
    city: '',
    direccion: '',
    postal: '',
    petFriendly: false,
    tipoVivienda: 'Piso' as 'Piso' | 'Casa' | 'Finca',
    alquilerOCompra: 'Alquiler' as 'Alquiler' | 'Propiedad',
    permisoCasero: false,
    tieneJardin: false,
    tieneMascotas: false,
    acuerdoVisitas: true,
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apiService
        .getAnimalById(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((data) => {
          this.animal.set(data);
          this.adoptionStatus.set(
            data.localAdoptionStatus || data.estadoAdopcion || 'Disponible',
          );
        });

      // Verificamos si el usuario actual ya ha enviado un formulario para este animal
      const currentUser = this.authService.getCurrentUser();
      if (currentUser?._id) {
        this.apiService
          .getForm()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((forms) => {
            // El backend ya devuelve solo los formularios del usuario.
            const req = forms.find((f) => f.animalExternalId === id);
            if (req) {
              // Si ya hay solicitud, guardamos los datos y lo enviamos directo al estado de seguimiento (Paso 4)
              this.existingRequest.set(req);
              this.currentStep.set(4);
            }
          });
      }
    }
  }

  puedeAdoptar(): boolean {
    return this.adoptionStatus().toLowerCase() === 'disponible';
  }

  irAPaso(paso: number): void {
    this.currentStep.set(paso);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Subir al inicio al cambiar de paso
  }

  enviarFormulario(): void {
    const animalId = this.animal()?.id;
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser?._id) {
      this.statusMessage.set(
        this.translate.instant('ADOPTION.LOGIN_REQUIRED'),
      );
      return;
    }

    if (!this.puedeAdoptar()) {
      this.statusMessage.set(
        this.translate.instant('ADOPTION.ALREADY_STATUS', {
          status: this.adoptionStatus().toLowerCase(),
        }),
      );
      return;
    }

    if (animalId) {
      const payload: AdoptionFormInput = {
        animalExternalId: animalId,
        ...this.formData,
        postal: Number(this.formData.postal), // 🔹 Convertimos a número
      };

      this.isSubmitting.set(true);
      this.statusMessage.set(null);

      this.apiService.postForm(payload).subscribe({
        next: () => this.irAPaso(3), // Si todo va bien, pasamos a la pantalla de éxito
        error: (err) => {
          console.error('Error al enviar solicitud', err);
          this.statusMessage.set(
            this.translate.instant('ADOPTION.SEND_ERROR'),
          );
          this.isSubmitting.set(false);
        },
        complete: () => this.isSubmitting.set(false),
      });
    }
  }
}
