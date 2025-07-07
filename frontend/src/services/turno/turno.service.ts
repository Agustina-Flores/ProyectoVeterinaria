import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class TurnoService {

  private apiUrl = 'http://localhost:5195/api'; 
  constructor(private http: HttpClient , private router: Router) { }

  obtenerTurnos():Observable<any> {
    return this.http.get(`${this.apiUrl}/turnos`);
  }
  agregarTurnos(turno:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/turnos`, turno);
  }
  editarTurno(id: number, turno: any): Observable<any> {
      return this.http.put(`${this.apiUrl}/turnos/${id}`, turno);
  }
  eliminarTurno(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/turnos/${id}`);
  }
}
