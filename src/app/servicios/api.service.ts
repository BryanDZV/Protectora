import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Animal, PaginatedAnimals } from '../types/animal.types';
import { AdoptionForm, AdoptionFormInput } from '../types/form.types';

export interface AnimalFilters {
  especie?: string;
  genero?: string;
  size?: string;
  rangoEdad?: string;
  texto?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl.replace(/\/$/, '');
  private readonly animalesUrl = `${this.baseUrl}/animales`;
  private readonly formUrl = `${this.baseUrl}/form`;

  constructor(private readonly http: HttpClient) {}

  // ================================
  // ANIMALES (BFF: los datos vienen de RescueGroups)
  // ================================
  public getAnimalesPage(
    page = 1,
    limit = 12,
    filters: AnimalFilters = {},
  ): Observable<PaginatedAnimals> {
    let params = new HttpParams().set('page', page).set('limit', limit);

    (Object.keys(filters) as (keyof AnimalFilters)[]).forEach((key) => {
      const value = filters[key];
      if (value) {
        params = params.set(key, value);
      }
    });

    return this.http.get<PaginatedAnimals>(this.animalesUrl, { params });
  }

  public getAnimalById(id: string): Observable<Animal> {
    return this.http.get<Animal>(`${this.animalesUrl}/${id}`);
  }

  // ================================
  // FORMULARIOS (MongoDB)
  // ================================
  public getForm(): Observable<AdoptionForm[]> {
    return this.http.get<AdoptionForm[]>(this.formUrl);
  }

  public postForm(form: AdoptionFormInput): Observable<AdoptionForm> {
    return this.http.post<AdoptionForm>(this.formUrl, form);
  }
}
