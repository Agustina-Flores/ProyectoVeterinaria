import { Cliente } from './cliente.model';

export interface Paciente {
  id: number;
  nombre: string;
  especie: string;
  raza: string; 
  edad: string; 
  peso: number; 
  cliente: Cliente;
  clienteId: number;
}