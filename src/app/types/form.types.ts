import { User } from './user.types';

// Formulario tal y como lo devuelve el backend (el usuario viene populado).
export interface AdoptionForm {
  _id?: string;
  user?: string | User;
  animalExternalId: string;
  telf: string;
  dni: string;
  direccion: string;
  postal: number;
  city: string;
  petFriendly: boolean;
  tieneMascotas: boolean;
  tipoVivienda: 'Piso' | 'Casa' | 'Finca';
  alquilerOCompra: 'Alquiler' | 'Propiedad';
  permisoCasero: boolean;
  tieneJardin: boolean;
  acuerdoVisitas: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Datos que envía el frontend al crear un formulario.
// El usuario NO se envía: se toma de la cookie de sesión.
export interface AdoptionFormInput {
  animalExternalId: string;
  telf: string;
  dni: string;
  direccion: string;
  postal: number;
  city: string;
  petFriendly: boolean;
  tieneMascotas: boolean;
  tipoVivienda: 'Piso' | 'Casa' | 'Finca';
  alquilerOCompra: 'Alquiler' | 'Propiedad';
  permisoCasero: boolean;
  tieneJardin: boolean;
  acuerdoVisitas: boolean;
}
