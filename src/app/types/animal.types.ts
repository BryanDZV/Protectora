export interface AnimalHealth {
  vacunado: boolean;
  desparasitado: boolean;
  sano: boolean;
  esterilizado: boolean;
  identificado: boolean;
  microchip: boolean;
}

// DTO que devuelve el BFF en /animales (normalizado desde RescueGroups).
export interface Animal {
  id: string;
  nombre: string;
  especie: string;
  genero: string;
  rangoEdad: string;
  fechaNacimiento?: string | null;
  size: string;
  peso: number;
  salud: AnimalHealth;
  personalidad: string[];
  historia: string;
  aSaber: string;
  requisitosAdopcion: string;
  tasaAdopcion: number;
  permiteEnvio: boolean;
  ubicacion: string;
  foto: string;
  imagenes: string[];
  estadoAdopcion: string;
  isFavorite: boolean;
  localAdoptionStatus: string | null;
}

export interface Pagination {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

export interface PaginatedAnimals {
  data: Animal[];
  pagination: Pagination;
}
