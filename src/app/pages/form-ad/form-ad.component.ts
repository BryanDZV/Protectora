import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../../servicios/api.service';
import { AuthServiceService } from '../../servicios/auth.service.service';
import { Animal } from '../../types/animal.types';
import { AdoptionForm } from '../../types/form.types';

@Component({
  selector: 'app-form-ad',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './form-ad.component.html',
  styleUrl: './form-ad.component.scss',
})
export class FormAdComponent {
  private readonly fb = inject(FormBuilder);
  private readonly apiService = inject(ApiService);
  private readonly authService = inject(AuthServiceService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly selectedAnimalId = signal<string | null>(null);
  public selectedAnimal = signal<Animal | null>(null);
  public isSubmitting = signal(false);
  public errorMessage = signal<string | null>(null);

  public readonly form = this.fb.nonNullable.group({
    telf: ['', [Validators.required, Validators.minLength(9)]],
    dni: ['', [Validators.required, Validators.minLength(8)]],
    city: ['', [Validators.required]],
    direccion: ['', [Validators.required]],
    postal: [0, [Validators.required, Validators.min(10000)]],
    petFriendly: [false],
    tieneMascotas: [false],
    tipoVivienda: ['Piso' as 'Piso' | 'Casa' | 'Finca', [Validators.required]],
    alquilerOCompra: [
      'Alquiler' as 'Alquiler' | 'Propiedad',
      [Validators.required],
    ],
    permisoCasero: [false],
    tieneJardin: [false],
    acuerdoVisitas: [true],
  });

  ngOnInit(): void {
    const animalId = localStorage.getItem('selectedAnimalId');
    this.selectedAnimalId.set(animalId);

    if (!animalId) {
      this.errorMessage.set('No hay un animal seleccionado para la solicitud.');
      return;
    }

    this.apiService
      .getAnimalbyId(animalId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (animal) => this.selectedAnimal.set(animal),
        error: () =>
          this.errorMessage.set(
            'No se ha podido cargar el animal seleccionado.',
          ),
      });
  }

  submit(): void {
    const currentUser = this.authService.currentUserSig();
    const selectedAnimalId = this.selectedAnimalId();

    if (!currentUser?._id || !selectedAnimalId) {
      this.errorMessage.set(
        'Faltan datos de usuario o animal para enviar la solicitud.',
      );
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage.set('Revisa los campos obligatorios.');
      return;
    }

    const payload: AdoptionForm = {
      user_id: currentUser._id,
      animal_id: selectedAnimalId,
      ...this.form.getRawValue(),
    };

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.apiService.postForm(payload).subscribe({
      next: () => {
        localStorage.removeItem('selectedAnimalId');
        this.router.navigate(['/home/adopcion-estado']);
      },
      error: () => {
        this.errorMessage.set(
          'No se ha podido enviar la solicitud de adopción.',
        );
        this.isSubmitting.set(false);
      },
      complete: () => this.isSubmitting.set(false),
    });
  }
}
