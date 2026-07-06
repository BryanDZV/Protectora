import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Animal } from '../types/animal.types';

export interface RescueGroupsSearchFilters {
  especie?: string;
  genero?: string;
  size?: string;
  rangoEdad?: string;
  texto?: string;
  resultStart?: number;
  resultLimit?: number;
}

interface RescueGroupsResponse {
  status?: string;
  messages?: any;
  data?: any[] | Record<string, any>;
}

@Injectable({
  providedIn: 'root',
})
export class RescueGroupsService {
  private readonly http = inject(HttpClient);
  private readonly proxyUrl = environment.rescueGroupsProxyUrl;

  public buscarAnimales(
    filtros: RescueGroupsSearchFilters = {},
  ): Observable<Animal[]> {
    const payload = this.buildPublicSearchPayload(filtros);
    return this.http
      .post<RescueGroupsResponse>(this.proxyUrl, payload)
      .pipe(map((resp) => this.mapResponse(resp)));
  }

  public getAnimalbyId(id: string): Observable<Animal> {
    const payload = {
      objectType: 'animals',
      objectAction: 'publicView',
      values: [{ animalID: id }],
      fields: [
        'animalID',
        'animalOrgID',
        'animalName',
        'animalSpecies',
        'animalBreed',
        'animalSex',
        'animalGeneralAge',
        'animalBirthdate',
        'animalSizeCurrent',
        'animalGeneralSizePotential',
        'animalStatus',
        'animalAltered',
        'animalDeclawed',
        'animalUptodate',
        'animalMicrochipped',
        'animalHousetrained',
        'animalDescription',
        'animalDescriptionPlain',
        'animalThumbnailUrl',
        'animalUrl',
        'animalLocation',
        'animalLocationCitystate',
        'locationCity',
        'locationState',
        'locationPostalcode',
        'locationCountry',
        'animalAdoptionFee',
        'animalAffectionate',
        'animalPlayful',
        'animalGentle',
        'animalIntelligent',
        'animalObedient',
        'animalTimid',
        'animalEventempered',
        'animalEagerToPlease',
        'animalIndependent',
        'animalLoyal',
        'animalPictures',
      ],
    };

    return this.http
      .post<RescueGroupsResponse>(this.proxyUrl, payload)
      .pipe(
        map((resp) => {
          const animal = this.extractViewRecord(resp);
          return this.normalizeAnimal(animal);
        }),
      );
  }

  private buildPublicSearchPayload(filtros: RescueGroupsSearchFilters): any {
    const filters: any[] = [
      {
        fieldName: 'animalStatus',
        operation: 'equals',
        criteria: 'Available',
      },
    ];

    if (filtros.especie) {
      filters.push({
        fieldName: 'animalSpecies',
        operation: 'equals',
        criteria: this.toEnglishSpecies(filtros.especie),
      });
    }
    if (filtros.genero) {
      filters.push({
        fieldName: 'animalSex',
        operation: 'equals',
        criteria: this.toEnglishSex(filtros.genero),
      });
    }
    if (filtros.size) {
      filters.push({
        fieldName: 'animalGeneralSizePotential',
        operation: 'equals',
        criteria: this.toEnglishSize(filtros.size),
      });
    }
    if (filtros.rangoEdad) {
      filters.push({
        fieldName: 'animalGeneralAge',
        operation: 'equals',
        criteria: this.toEnglishAge(filtros.rangoEdad),
      });
    }
    if (filtros.texto) {
      filters.push({
        fieldName: 'animalName',
        operation: 'contains',
        criteria: filtros.texto,
      });
    }

    return {
      objectType: 'animals',
      objectAction: 'publicSearch',
      search: {
        resultStart: String(filtros.resultStart ?? 0),
        resultLimit: String(filtros.resultLimit ?? 50),
        resultSort: 'animalID',
        resultOrder: 'asc',
        filters,
        filterProcessing: '1',
        fields: [
          'animalID',
          'animalOrgID',
          'animalName',
          'animalSpecies',
          'animalBreed',
          'animalSex',
          'animalGeneralAge',
          'animalBirthdate',
          'animalSizeCurrent',
          'animalGeneralSizePotential',
          'animalStatus',
          'animalAltered',
          'animalDeclawed',
          'animalUptodate',
          'animalMicrochipped',
          'animalHousetrained',
          'animalDescription',
          'animalDescriptionPlain',
          'animalThumbnailUrl',
          'animalUrl',
          'animalLocation',
          'animalLocationCitystate',
          'locationCity',
          'locationState',
          'locationPostalcode',
          'locationCountry',
          'animalAdoptionFee',
          'animalAdoptionPending',
          'animalAffectionate',
          'animalPlayful',
          'animalGentle',
          'animalIntelligent',
          'animalObedient',
          'animalTimid',
          'animalEventempered',
          'animalEagerToPlease',
          'animalIndependent',
          'animalPictures',
        ],
      },
    };
  }

  private mapResponse(resp: RescueGroupsResponse): Animal[] {
    if (!resp || !resp.data) {
      return [];
    }
    const records = Array.isArray(resp.data)
      ? resp.data
      : Object.values(resp.data);
    return records
      .filter((r) => r && typeof r === 'object' && !this.isPlaceholder(r))
      .map((r) => this.normalizeAnimal(r));
  }

  private isPlaceholder(raw: any): boolean {
    const name = String(raw.animalName ?? '').toLowerCase();
    return (
      name.includes('adoption-read') ||
      name.includes('read first') ||
      name.includes('instructions')
    );
  }

  private extractViewRecord(resp: RescueGroupsResponse): any {
    if (!resp || !resp.data) {
      return {};
    }
    if (Array.isArray(resp.data)) {
      return resp.data[0] || {};
    }
    const values = Object.values(resp.data);
    return values[0] || {};
  }

  private normalizeAnimal(raw: any): Animal {
    if (!raw) {
      return this.emptyAnimal();
    }

    const especie = this.translateSpecies(raw.animalSpecies);
    const genero = this.translateSex(raw.animalSex);
    const rangoEdad = this.translateAge(raw.animalGeneralAge);
    const size = this.translateSize(
      raw.animalSizeCurrent || raw.animalGeneralSizePotential,
    );
    const ubicacion =
      raw.animalLocationCitystate ||
      raw.animalLocation ||
      [raw.locationCity, raw.locationState]
        .filter(Boolean)
        .join(', ') ||
      '';
    const estadoAdopcion = this.translateStatus(
      raw.animalStatus,
      raw.animalAdoptionPending,
    );
    const foto = this.pickPicture(raw);
    const personalidad = this.buildPersonalidad(raw);
    const salud = {
      vacunado: this.isYes(raw.animalUptodate),
      desparasitado: this.isYes(raw.animalUptodate),
      sano: true,
      esterilizado: this.isYes(raw.animalAltered),
      identificado: false,
      microchip: this.isYes(raw.animalMicrochipped),
    };

    return {
      _id: String(raw.animalID ?? ''),
      especie,
      rangoEdad,
      edad: rangoEdad,
      fechaNacimiento: raw.animalBirthdate ?? null,
      fechaDeNacimiento: raw.animalBirthdate ?? null,
      genero,
      foto,
      ubicacion,
      ciudad: raw.locationCity || ubicacion,
      nombre: raw.animalName || 'Sin nombre',
      size,
      tamaño: size,
      peso: undefined,
      personalidad,
      historia: this.stripHtml(
        raw.animalDescription || raw.animalDescriptionPlain || '',
      ),
      aSaber: '',
      requisitosAdopcion: '',
      tasaAdopcion: this.parseNumber(raw.animalAdoptionFee),
      permiteEnvio: true,
      seEnvia: true,
      estadoAdopcion,
      adoptionState: estadoAdopcion,
      salud,
      vacunado: salud.vacunado,
      desparasitado: salud.desparasitado,
      sano: salud.sano,
      esterilizado: salud.esterilizado,
      identificado: salud.identificado,
      microchip: salud.microchip,
    };
  }

  private emptyAnimal(): Animal {
    return {
      _id: '',
      especie: '',
      rangoEdad: '',
      edad: '',
      genero: '',
      foto: '',
      ubicacion: '',
      nombre: '',
      size: '',
      estadoAdopcion: 'Disponible',
      salud: {
        vacunado: false,
        desparasitado: false,
        sano: true,
        esterilizado: false,
        identificado: false,
        microchip: false,
      },
    };
  }

  private pickPicture(raw: any): string {
    if (raw.animalThumbnailUrl) {
      return raw.animalThumbnailUrl;
    }
    const pics = raw.animalPictures;
    if (Array.isArray(pics) && pics.length > 0) {
      const first = pics[0];
      if (typeof first === 'string') return first;
      if (first && typeof first === 'object') {
        return (
          first.thumbnailUrl ||
          first.mediumUrl ||
          first.largeUrl ||
          first.url ||
          ''
        );
      }
    }
    return '';
  }

  private buildPersonalidad(raw: any): string[] {
    const traits: { key: string; label: string }[] = [
      { key: 'animalAffectionate', label: 'Cariñoso' },
      { key: 'animalPlayful', label: 'Juguetón' },
      { key: 'animalGentle', label: 'Tranquilo' },
      { key: 'animalIntelligent', label: 'Inteligente' },
      { key: 'animalObedient', label: 'Obediente' },
      { key: 'animalEventempered', label: 'Equilibrado' },
      { key: 'animalTimid', label: 'Tímido' },
      { key: 'animalEagerToPlease', label: 'Complaciente' },
      { key: 'animalIndependent', label: 'Independiente' },
    ];
    return traits
      .filter((t) => this.isYes(raw[t.key]))
      .map((t) => t.label);
  }

  private isYes(value: any): boolean {
    return (
      value === true ||
      String(value ?? '').trim().toLowerCase() === 'yes'
    );
  }

  private parseNumber(value: any): number | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    const n = Number(String(value).replace(/[^0-9.]/g, ''));
    return Number.isFinite(n) ? n : undefined;
  }

  private translateSpecies(value: any): string {
    const v = String(value ?? '').toLowerCase();
    if (v === 'dog') return 'Perro';
    if (v === 'cat') return 'Gato';
    if (v === 'rabbit') return 'Conejo';
    if (v === 'horse') return 'Caballo';
    if (v === 'bird') return 'Ave';
    if (v === 'small furry') return 'Pequeño mamífero';
    if (v === 'barnyard') return 'Granja';
    if (v === 'reptile') return 'Reptil';
    return String(value ?? '');
  }

  private toEnglishSpecies(value: string): string {
    const v = String(value ?? '').toLowerCase();
    if (v === 'perro') return 'Dog';
    if (v === 'gato') return 'Cat';
    if (v === 'conejo') return 'Rabbit';
    if (v === 'caballo') return 'Horse';
    if (v === 'ave') return 'Bird';
    if (v === 'reptil') return 'Reptile';
    return value || 'Dog';
  }

  private translateSex(value: any): string {
    const v = String(value ?? '').toLowerCase();
    if (v === 'male') return 'Macho';
    if (v === 'female') return 'Hembra';
    return String(value ?? '');
  }

  private toEnglishSex(value: string): string {
    const v = String(value ?? '').toLowerCase();
    if (v === 'macho') return 'Male';
    if (v === 'hembra') return 'Female';
    return value || 'Male';
  }

  private translateAge(value: any): string {
    const v = String(value ?? '').toLowerCase();
    if (v === 'baby') return 'Cachorro';
    if (v === 'young') return 'Joven';
    if (v === 'adult') return 'Adulto';
    if (v === 'senior') return 'Senior';
    return String(value ?? '');
  }

  private toEnglishAge(value: string): string {
    const v = String(value ?? '').toLowerCase();
    if (v === 'cachorro') return 'Baby';
    if (v === 'joven') return 'Young';
    if (v === 'adulto') return 'Adult';
    if (v === 'senior') return 'Senior';
    return value || 'Adult';
  }

  private translateSize(value: any): string {
    const v = String(value ?? '').toLowerCase();
    if (v === 'small') return 'Pequeño';
    if (v === 'medium') return 'Mediano';
    if (v === 'large') return 'Grande';
    if (v === 'extra large') return 'Muy grande';
    return String(value ?? '');
  }

  private toEnglishSize(value: string): string {
    const v = String(value ?? '').toLowerCase();
    if (v === 'pequeño' || v === 'pequeno') return 'Small';
    if (v === 'mediano') return 'Medium';
    if (v === 'grande') return 'Large';
    if (v === 'muy grande') return 'Extra Large';
    return value || 'Medium';
  }

  private translateStatus(status: any, pending: any): string {
    const s = String(status ?? '').toLowerCase();
    if (s === 'available') {
      if (this.isYes(pending)) return 'En proceso';
      return 'Disponible';
    }
    if (s === 'adopted') return 'Adoptado';
    if (s === 'pending' || s === 'adoption pending') return 'En proceso';
    if (s === 'hold') return 'En reserva';
    if (s === 'coming soon') return 'Próximamente';
    if (s === 'not available') return 'No disponible';
    return String(status ?? 'Disponible');
  }

  private stripHtml(html: string): string {
    if (!html) return '';
    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&ndash;/g, '–')
      .replace(/&mdash;/g, '—')
      .replace(/&ldquo;/g, '"')
      .replace(/&rdquo;/g, '"')
      .replace(/&rsquo;/g, "'")
      .replace(/&lsquo;/g, "'")
      .replace(/&hellip;/g, '...')
      .trim();
  }
}