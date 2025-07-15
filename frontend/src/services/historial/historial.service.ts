import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { Router } from '@angular/router';
import { HistoriaClinica } from '../../model/historiaClinicas.model'  

@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  private apiUrl = 'http://localhost:5195/api'; 
  constructor(private http: HttpClient , private router: Router) { }

  getHistorialPorPaciente(id: number): Observable<HistoriaClinica[]> {
    return this.http.get<HistoriaClinica[]>(`${this.apiUrl}/historias/paciente/${id}`);
  }
  agregarHistorial(historialClinico:any): Observable<HistoriaClinica> {
    return this.http.post<HistoriaClinica>(`${this.apiUrl}/historias`, historialClinico);
  }
  
}
