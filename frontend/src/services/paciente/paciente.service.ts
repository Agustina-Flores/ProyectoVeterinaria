import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private apiUrl = 'http://localhost:5195/api';
  constructor(private http: HttpClient , private router: Router) { }

  obtenerPacientes():Observable<any> {
    return this.http.get(`${this.apiUrl}/pacientes`);
  }
  getPacientesPorCliente(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/clientes/${id}/pacientes`);
  }
  editarPaciente(id: number, paciente: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/pacientes/${id}`, paciente);
  }
  agregarPacientes(paciente:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pacientes`, paciente);
  }
  eliminarPaciente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pacientes/${id}`);
  }
  
}
