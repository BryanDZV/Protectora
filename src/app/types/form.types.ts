export interface AdoptionForm {
  _id?: string;
  user_id: string;
  animal_id: string;
  telf: string;
  dni: string;
  city: string;
  direccion: string;
  postal: number;
  petFriendly: boolean;
  tieneMascotas: boolean;
  tipoVivienda: 'Piso' | 'Casa' | 'Finca';
  alquilerOCompra: 'Alquiler' | 'Propiedad';
  permisoCasero: boolean;
  tieneJardin: boolean;
  acuerdoVisitas: boolean;
  direction?: string;
  petfrienly?: boolean;
  pets?: boolean;
  home?: string;
  rental?: string;
  casero?: boolean;
  garden?: boolean;
  visit?: boolean;
}
