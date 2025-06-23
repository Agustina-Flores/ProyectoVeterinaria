export interface Turno {
  id: number;
  fechaHora: string; 
  estado: string;
  paciente: {
    id: number;
    nombre: string;
  };
  veterinario: {
    id: number;
    nombre: string;
  };
  notas?: string;
}