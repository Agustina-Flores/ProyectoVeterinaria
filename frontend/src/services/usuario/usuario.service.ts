import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { Router } from '@angular/router';
import { Usuario } from '../../model/usuario.model'
import { environment } from '../../environment/environment.prod'

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:5195/api'; 
  constructor(private http: HttpClient , private router: Router) { }

  obtenerUsuarios():Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${environment.apiUrl}/auth/usuarios`);
  }
  obtenerVeterinarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${environment.apiUrl}/auth/veterinarios`);
  }
  editarUsuario(id: number, usuario: any): Observable<Usuario> {
    return this.http.put<Usuario>(`${environment.apiUrl}/auth/usuarios/${id}`, usuario);
  }
  eliminarUsuario(id: number): Observable<Usuario> {
    return this.http.delete<Usuario>(`${environment.apiUrl}/auth/usuarios/${id}`);
  }
  volverDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
