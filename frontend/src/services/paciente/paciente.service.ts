import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { Router } from '@angular/router'
import { Paciente } from '../../model/paciente.model'

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private apiUrl = 'http://localhost:5195/api';
  constructor(private http: HttpClient , private router: Router) { }

  obtenerPacientes():Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.apiUrl}/pacientes`);
  }
  getPacientesPorCliente(id: number): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.apiUrl}/clientes/${id}/pacientes`);
  }
  editarPaciente(id: number, paciente: any): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.apiUrl}/pacientes/${id}`, paciente);
  }
  agregarPacientes(paciente:any): Observable<Paciente> {
    return this.http.post<Paciente>(`${this.apiUrl}/pacientes`, paciente);
  }
  eliminarPaciente(id: number): Observable<Paciente> {
    return this.http.delete<Paciente>(`${this.apiUrl}/pacientes/${id}`);
  }
  
}
