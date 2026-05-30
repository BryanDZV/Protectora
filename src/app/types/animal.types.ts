export interface Animal {
  _id: string;
  especie: string;
  edad: number;
  genero: string;
  foto: string;
  ciudad: string;
  nombre: string;
  tamaño: string;
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