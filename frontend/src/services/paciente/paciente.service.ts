import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { Router } from '@angular/router'
import { Paciente } from '../../model/paciente.model'
import { environment } from '../../environment/environment.prod'

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private apiUrl = 'http://localhost:5195/api';
  constructor(private http: HttpClient , private router: Router) { }

  obtenerPacientes():Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${environment.apiUrl}/pacientes`);
  }
  getPacientesPorCliente(id: number): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${environment.apiUrl}/clientes/${id}/pacientes`);
  }
  editarPaciente(id: number, paciente: any): Observable<Paciente> {
    return this.http.put<Paciente>(`${environment.apiUrl}/pacientes/${id}`, paciente);
  }
  agregarPacientes(paciente:any): Observable<Paciente> {
    return this.http.post<Paciente>(`${environment.apiUrl}/pacientes`, paciente);
  }
  eliminarPaciente(id: number): Observable<Paciente> {
    return this.http.delete<Paciente>(`${environment.apiUrl}/pacientes/${id}`);
  }
  
}
