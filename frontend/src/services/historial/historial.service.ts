import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { Router } from '@angular/router';
  
@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  private apiUrl = 'http://localhost:5195/api'; 
  constructor(private http: HttpClient , private router: Router) { }

  getHistorialPorPaciente(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/historias/paciente/${id}`);
  }
  agregarHistorial(historialClinico:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/historias`, historialClinico);
  }
  
}
