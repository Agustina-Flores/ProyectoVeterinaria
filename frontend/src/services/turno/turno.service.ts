import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { Router } from '@angular/router'
import { Turno } from '../../model/turno.model'
import { environment } from '../../environment/environment.prod'

@Injectable({
  providedIn: 'root'
})
export class TurnoService {

  private apiUrl = 'http://localhost:5195/api'; 
  constructor(private http: HttpClient , private router: Router) { }

  obtenerTurnos():Observable<Turno[]> {
    return this.http.get<Turno[]>(`${environment.apiUrl}/turnos`);
  }
  agregarTurnos(turno:any): Observable<Turno> {
    return this.http.post<Turno>(`${environment.apiUrl}/turnos`, turno);
  }
  editarTurno(id: number, turno: any): Observable<Turno> {
      return this.http.put<Turno>(`${environment.apiUrl}/turnos/${id}`, turno);
  }
  eliminarTurno(id: number): Observable<Turno> {
    return this.http.delete<Turno>(`${environment.apiUrl}/turnos/${id}`);
  }
}
