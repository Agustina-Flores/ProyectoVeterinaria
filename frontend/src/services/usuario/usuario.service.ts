import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:5195/api'; 
  constructor(private http: HttpClient , private router: Router) { }

  obtenerUsuarios():Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/usuarios`);
  }
  obtenerVeterinarios(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/veterinarios`);
  }
  editarUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/auth/usuarios/${id}`, usuario);
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/auth/usuarios/${id}`);
  }
  volverDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
