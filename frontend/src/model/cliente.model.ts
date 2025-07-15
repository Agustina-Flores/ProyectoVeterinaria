import { Paciente } from './paciente.model';

export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string; 
  direccion?: string; 
  mascotas?: Paciente[]; 
}