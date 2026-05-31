export interface User {
  _id: string;
  email: string;
  name: string;
  favPets?: string[];
  pets?: string[];
  inProcessPets?: string[];
  info?: string[];
}
