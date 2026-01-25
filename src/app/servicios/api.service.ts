import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed } from '@angular/core';
import { Observable } from 'rxjs';
import Animal from '../../../animal.interface';
import { environment } from '../../environments/environment';

interface AnimalResponse {
  success: boolean;
  data: Animal;
}

interface AnimalListResponse {
  success: boolean;
  data: Animal[];
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl: string = environment.apiUrl;
  private animalesUrl: string = `${this.baseUrl}/animales`;
  private formUrl: string = `${this.baseUrl}/form`;
  private userUrl: string = `${this.baseUrl}/form`;

  // Signals para manejo de estado reactivo
  private animalesFavoritosSignal = signal<Animal[]>([]);

  // Computed para obtener cantidad de favoritos
  public cantidadFavoritos = computed(
    () => this.animalesFavoritosSignal().length,
  );

  constructor(private http: HttpClient) {}

  // ========== FAVORITOS (usando Signals) ==========

  // Obtener signal de favoritos (reactivo)
  public obtenerAnimalesFavoritos() {
    return this.animalesFavoritosSignal.asReadonly();
  }

  // Agregar animal a favoritos
  public agregarAnimalFavorito(animal: Animal): void {
    const actuales = this.animalesFavoritosSignal();
    if (!actuales.some((a) => a._id === animal._id)) {
      this.animalesFavoritosSignal.set([...actuales, animal]);
    }
  }

  // Eliminar animal de favoritos
  public eliminarAnimalFavorito(animal: Animal): void {
    const actuales = this.animalesFavoritosSignal();
    const filtrados = actuales.filter((a) => a._id !== animal._id);
    this.animalesFavoritosSignal.set(filtrados);
  }

  // Limpiar todos los favoritos
  public limpiarFavoritos(): void {
    this.animalesFavoritosSignal.set([]);
  }

  // Verificar si un animal es favorito
  public esAnimalFavorito(animalId: string): boolean {
    return this.animalesFavoritosSignal().some((a) => a._id === animalId);
  }

  // ========== UPLOAD DE IMÁGENES ==========

  public subirImagen(imageFile: File): Observable<any> {
    const imagenCliente = new FormData();
    imagenCliente.append('image', imageFile, imageFile.name);
    return this.http.post<any>(`${this.baseUrl}/upload`, imagenCliente);
  }

  // ========== ANIMALES (CRUD) ==========

  public enviarDatos(data: Partial<Animal>): Observable<AnimalResponse> {
    return this.http.post<AnimalResponse>(`${this.baseUrl}/animales`, data);
  }

  public getAnimalesConURL(url: string): Observable<Animal[]> {
    return this.http.get<Animal[]>(url);
  }

  public getAnimales(): Observable<Animal[]> {
    return this.http.get<Animal[]>(this.animalesUrl);
  }

  public getAnimalbyId(id: string): Observable<Animal> {
    return this.http.get<Animal>(`${this.animalesUrl}/${id}`);
  }

  public postAnimal(animal: Partial<Animal>): Observable<AnimalResponse> {
    return this.http.post<AnimalResponse>(this.animalesUrl, animal);
  }

  public putAnimal(
    id: string,
    animal: Partial<Animal>,
  ): Observable<AnimalResponse> {
    return this.http.put<AnimalResponse>(`${this.animalesUrl}/${id}`, animal);
  }

  public borrarAnimal(id: string): Observable<any> {
    return this.http.delete(`${this.animalesUrl}/${id}`);
  }

  // ========== FORMS (CRUD) ==========

  public getFormConURL(url: string): Observable<any[]> {
    return this.http.get<any[]>(url);
  }

  public getForm(): Observable<any[]> {
    return this.http.get<any[]>(this.formUrl);
  }

  public getFormById(id: string): Observable<any> {
    return this.http.get<any>(`${this.formUrl}/${id}`);
  }

  public postForm(form: any): Observable<any> {
    return this.http.post<any>(this.formUrl, form);
  }

  public putForm(id: string, form: any): Observable<any> {
    return this.http.put<any>(`${this.formUrl}/${id}`, form);
  }

  public borrarForm(id: string): Observable<any> {
    return this.http.delete(`${this.formUrl}/${id}`);
  }

  // ========== USERS (CRUD) ==========

  public getUserConURL(url: string): Observable<any[]> {
    return this.http.get<any[]>(url);
  }

  public getUser(): Observable<any[]> {
    return this.http.get<any[]>(this.userUrl);
  }

  public getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.userUrl}/${id}`);
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
}
