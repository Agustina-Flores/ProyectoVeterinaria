import { Paciente } from "./paciente.model";

export interface HistoriaClinica {
  id: number;
  fecha: string;
  diagnostico: string;
  tratamiento: string; 
  observaciones: string;  
  paciente?: Paciente;
  pacienteId:number;
}