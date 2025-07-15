export interface Turno {
  id: number;
  fechaHora: string; 
  estado: string;
  paciente: {
    id: number | null;
    nombre: string;
  };
  veterinario: {
    id: number | null;
    nombre: string;
  };
  notas?: string;
}