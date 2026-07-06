import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Animal } from '../types/animal.types';
import { AdoptionForm } from '../types/form.types';
import { User } from '../types/user.types';
import { RescueGroupsService } from './rescue-groups.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl.replace(/\/$/, '');
  private readonly animalesUrl = `${this.baseUrl}/animales`;
  private readonly formUrl = `${this.baseUrl}/form`;
  private readonly userUrl = `${this.baseUrl}/user`;
  private readonly rescueGroups = inject(RescueGroupsService);

  private readonly animalesFavoritosSignal = signal<Animal[]>(
    this.loadFavoritesFromStorage(),
  );

  public cantidadFavoritos = computed(
    () => this.animalesFavoritosSignal().length,
  );

  constructor(private http: HttpClient) {}

  private loadFavoritesFromStorage(): Animal[] {
    const stored = localStorage.getItem('favoritos');
    return stored ? JSON.parse(stored) : [];
  }

  private saveFavoritesToStorage(favoritos: Animal[]): void {
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
  }

  public obtenerAnimalesFavoritos() {
    return this.animalesFavoritosSignal.asReadonly();
  }

  public agregarAnimalFavorito(animal: Animal): void {
    const actuales = this.animalesFavoritosSignal();
    if (!actuales.some((item) => item._id === animal._id)) {
      const nuevos = [...actuales, animal];
      this.animalesFavoritosSignal.set(nuevos);
      this.saveFavoritesToStorage(nuevos);
    }
  }

  public eliminarAnimalFavorito(animal: Animal): void {
    const nuevos = this.animalesFavoritosSignal().filter(
      (item) => item._id !== animal._id,
    );
    this.animalesFavoritosSignal.set(nuevos);
    this.saveFavoritesToStorage(nuevos);
  }

  public limpiarFavoritos(): void {
    this.animalesFavoritosSignal.set([]);
    this.saveFavoritesToStorage([]);
  }

  public esAnimalFavorito(animalId: string): boolean {
    return this.animalesFavoritosSignal().some((item) => item._id === animalId);
  }

  public subirImagen(imageFile: File): Observable<any> {
    const imagenCliente = new FormData();
    imagenCliente.append('image', imageFile, imageFile.name);
    return this.http.post<any>(`${this.baseUrl}/upload`, imagenCliente);
  }

  public getAnimalesConURL(url: string): Observable<Animal[]> {
    return this.http
      .get<any[]>(url)
      .pipe(
        map((animales) =>
          animales.map((animal) => this.normalizeAnimal(animal)),
        ),
      );
  }

  public getAnimales(): Observable<Animal[]> {
    if (environment.rescueGroupsEnabled) {
      return this.rescueGroups.buscarAnimales();
    }
    return this.http
      .get<any[]>(this.animalesUrl)
      .pipe(
        map((animales) =>
          animales.map((animal) => this.normalizeAnimal(animal)),
        ),
      );
  }

  public getAnimalbyId(id: string): Observable<Animal> {
    if (environment.rescueGroupsEnabled) {
      return this.rescueGroups.getAnimalbyId(id);
    }
    return this.http
      .get<any>(`${this.animalesUrl}/${id}`)
      .pipe(map((animal) => this.normalizeAnimal(animal)));
  }

  public enviarDatos(data: Partial<Animal>): Observable<Animal> {
    return this.postAnimal(data);
  }

  public postAnimal(animal: Partial<Animal>): Observable<Animal> {
    return this.http
      .post<any>(this.animalesUrl, this.normalizeAnimalPayload(animal))
      .pipe(map((createdAnimal) => this.normalizeAnimal(createdAnimal)));
  }

  public putAnimal(id: string, animal: Partial<Animal>): Observable<Animal> {
    return this.http
      .put<any>(
        `${this.animalesUrl}/${id}`,
        this.normalizeAnimalPayload(animal),
      )
      .pipe(map((updatedAnimal) => this.normalizeAnimal(updatedAnimal)));
  }

  public borrarAnimal(id: string): Observable<any> {
    return this.http.delete(`${this.animalesUrl}/${id}`);
  }

  public getFormConURL(url: string): Observable<AdoptionForm[]> {
    return this.http
      .get<any[]>(url)
      .pipe(map((forms) => forms.map((form) => this.normalizeForm(form))));
  }

  public getForm(): Observable<AdoptionForm[]> {
    return this.http
      .get<any[]>(this.formUrl)
      .pipe(map((forms) => forms.map((form) => this.normalizeForm(form))));
  }

  public getFormById(id: string): Observable<AdoptionForm> {
    return this.http
      .get<any>(`${this.formUrl}/${id}`)
      .pipe(map((form) => this.normalizeForm(form)));
  }

  public postForm(form: Partial<AdoptionForm>): Observable<AdoptionForm> {
    return this.http
      .post<any>(this.formUrl, this.normalizeFormPayload(form))
      .pipe(map((createdForm) => this.normalizeForm(createdForm)));
  }

  public putForm(
    id: string,
    form: Partial<AdoptionForm>,
  ): Observable<AdoptionForm> {
    return this.http
      .put<any>(`${this.formUrl}/${id}`, this.normalizeFormPayload(form))
      .pipe(map((updatedForm) => this.normalizeForm(updatedForm)));
  }

  public borrarForm(id: string): Observable<any> {
    return this.http.delete(`${this.formUrl}/${id}`);
  }

  public getUserConURL(url: string): Observable<User[]> {
    return this.http.get<User[]>(url);
  }

  public getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.userUrl}/${id}`);
  }

  public postUser(user: any): Observable<any> {
    return this.http.post<any>(this.userUrl, user);
  }

  public putUser(id: string, user: any): Observable<any> {
    return this.http.put<any>(`${this.userUrl}/${id}`, user);
  }

  public borrarUser(id: string): Observable<any> {
    return this.http.delete(`${this.userUrl}/${id}`);
  }

  private normalizeAnimal(animal: any): Animal {
    const salud = animal?.salud ?? {
      vacunado: animal?.vacunado ?? false,
      desparasitado: animal?.desparasitado ?? false,
      sano: animal?.sano ?? false,
      esterilizado: animal?.esterilizado ?? false,
      identificado: animal?.identificado ?? false,
      microchip: animal?.microchip ?? false,
    };

    const fechaNacimiento =
      animal?.fechaNacimiento ?? animal?.fechaDeNacimiento ?? null;
    const rangoEdad = animal?.rangoEdad ?? animal?.edad ?? '';
    const ubicacion = animal?.ubicacion ?? animal?.ciudad ?? '';
    const size = animal?.size ?? animal?.tamaño ?? '';
    const permiteEnvio =
      typeof animal?.permiteEnvio === 'boolean'
        ? animal.permiteEnvio
        : !!animal?.seEnvia;
    const estadoAdopcion =
      animal?.estadoAdopcion ?? animal?.adoptionState ?? 'Disponible';

    return {
      ...animal,
      _id: String(animal?._id ?? ''),
      especie: animal?.especie ?? '',
      rangoEdad,
      edad: rangoEdad,
      fechaNacimiento,
      fechaDeNacimiento: fechaNacimiento,
      genero: animal?.genero ?? '',
      foto: animal?.foto ?? '',
      ubicacion,
      ciudad: animal?.ciudad ?? ubicacion,
      nombre: animal?.nombre ?? '',
      size,
      tamaño: animal?.tamaño ?? size,
      peso: animal?.peso,
      personalidad: animal?.personalidad ?? [],
      historia: animal?.historia,
      aSaber: animal?.aSaber,
      requisitosAdopcion: animal?.requisitosAdopcion,
      tasaAdopcion: animal?.tasaAdopcion,
      permiteEnvio,
      seEnvia: animal?.seEnvia ?? permiteEnvio,
      estadoAdopcion,
      adoptionState: animal?.adoptionState ?? estadoAdopcion,
      salud,
      vacunado: salud.vacunado,
      desparasitado: salud.desparasitado,
      sano: salud.sano,
      esterilizado: salud.esterilizado,
      identificado: salud.identificado,
      microchip: salud.microchip,
    };
  }

  private normalizeAnimalPayload(animal: Partial<Animal>): any {
    const salud = animal.salud ?? {
      vacunado: animal.vacunado,
      desparasitado: animal.desparasitado,
      sano: animal.sano,
      esterilizado: animal.esterilizado,
      identificado: animal.identificado,
      microchip: animal.microchip,
    };

    return {
      especie: animal.especie,
      rangoEdad: animal.rangoEdad ?? animal.edad,
      fechaNacimiento: animal.fechaNacimiento ?? animal.fechaDeNacimiento,
      genero: animal.genero,
      size: animal.size ?? animal.tamaño,
      peso: animal.peso,
      salud,
      nombre: animal.nombre,
      foto: animal.foto,
      ubicacion: animal.ubicacion ?? animal.ciudad,
      personalidad: animal.personalidad ?? [],
      historia: animal.historia,
      aSaber: animal.aSaber,
      requisitosAdopcion: animal.requisitosAdopcion,
      tasaAdopcion: animal.tasaAdopcion,
      permiteEnvio:
        typeof animal.permiteEnvio === 'boolean'
          ? animal.permiteEnvio
          : animal.seEnvia,
      estadoAdopcion: animal.estadoAdopcion ?? animal.adoptionState,
    };
  }

  private normalizeForm(form: any): AdoptionForm {
    return {
      ...form,
      _id: form?._id,
      user_id: this.extractId(form?.user_id),
      animal_id: this.extractId(form?.animal_id),
      telf: form?.telf ?? '',
      dni: form?.dni ?? '',
      city: form?.city ?? '',
      direccion: form?.direccion ?? form?.direction ?? '',
      postal: form?.postal ?? 0,
      petFriendly:
        typeof form?.petFriendly === 'boolean'
          ? form.petFriendly
          : !!form?.petfrienly,
      tieneMascotas:
        typeof form?.tieneMascotas === 'boolean'
          ? form.tieneMascotas
          : !!form?.pets,
      tipoVivienda: form?.tipoVivienda ?? form?.home ?? 'Piso',
      alquilerOCompra: form?.alquilerOCompra ?? form?.rental ?? 'Alquiler',
      permisoCasero:
        typeof form?.permisoCasero === 'boolean'
          ? form.permisoCasero
          : !!form?.casero,
      tieneJardin:
        typeof form?.tieneJardin === 'boolean'
          ? form.tieneJardin
          : !!form?.garden,
      acuerdoVisitas:
        typeof form?.acuerdoVisitas === 'boolean'
          ? form.acuerdoVisitas
          : !!form?.visit,
      direction: form?.direction ?? form?.direccion ?? '',
      petfrienly: form?.petfrienly ?? form?.petFriendly,
      pets: form?.pets ?? form?.tieneMascotas,
      home: form?.home ?? form?.tipoVivienda,
      rental: form?.rental ?? form?.alquilerOCompra,
      casero: form?.casero ?? form?.permisoCasero,
      garden: form?.garden ?? form?.tieneJardin,
      visit: form?.visit ?? form?.acuerdoVisitas,
    };
  }

  private normalizeFormPayload(form: Partial<AdoptionForm>): any {
    return {
      user_id: form.user_id,
      animal_id: form.animal_id,
      telf: form.telf,
      dni: form.dni,
      city: form.city,
      direccion: form.direccion ?? form.direction,
      postal: form.postal,
      petFriendly: form.petFriendly ?? form.petfrienly,
      tieneMascotas: form.tieneMascotas ?? form.pets,
      tipoVivienda: form.tipoVivienda ?? form.home,
      alquilerOCompra: form.alquilerOCompra ?? form.rental,
      permisoCasero: form.permisoCasero ?? form.casero,
      tieneJardin: form.tieneJardin ?? form.garden,
      acuerdoVisitas: form.acuerdoVisitas ?? form.visit,
    };
  }

  private extractId(value: any): string {
    if (!value) {
      return '';
    }

    if (typeof value === 'string') {
      return value;
    }

    return value._id ?? value.id ?? '';
  }
}
