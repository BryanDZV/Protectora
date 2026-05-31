export interface Animal {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  especie: string;
  rangoEdad: string;
  edad?: string;
  fechaNacimiento?: string | Date;
  fechaDeNacimiento?: string | Date;
  genero: string;
  foto: string;
  ubicacion: string;
  ciudad?: string;
  nombre: string;
  size: string;
  tamaño?: string;
  peso?: number;
  personalidad?: string[];
  historia?: string;
  aSaber?: string;
  requisitosAdopcion?: string;
  tasaAdopcion?: number;
  permiteEnvio?: boolean;
  seEnvia?: boolean;
  estadoAdopcion: string;
  adoptionState?: string;
  salud?: {
    vacunado: boolean;
    desparasitado: boolean;
    sano: boolean;
    esterilizado: boolean;
    identificado: boolean;
    microchip: boolean;
  };
  vacunado?: boolean;
  desparasitado?: boolean;
  sano?: boolean;
  esterilizado?: boolean;
  identificado?: boolean;
  microchip?: boolean;
  favorito?: boolean;
}

export interface AnimalResponse {
  success: boolean;
  data: Animal;
}

export interface AnimalListResponse {
  success: boolean;
  data: Animal[];
}
