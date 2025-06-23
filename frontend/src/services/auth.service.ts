import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { Router } from '@angular/router';
  
@Injectable({
  providedIn: 'root'
})
export class AuthService {

   private apiUrl = 'http://localhost:5195/api'; 
  constructor(private http: HttpClient , private router: Router) { }

  login(email: string , password:string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password });
  }

 register(nombre: string, email: string, password: string, rol: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/auth/register`, { nombre, email, password, rol });
 }

  obtenerUsuarios():Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/usuarios`);
  }

  
  editarUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/auth/usuarios/${id}`, usuario);
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/auth/usuarios/${id}`);
  }
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  obtenerClientes():Observable<any> {
    return this.http.get(`${this.apiUrl}/clientes`);
  }
  agregarClientes(nombre: string, email: string, telefono: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/clientes`, { nombre, email, telefono });
  }
  editarCliente(id: number, cliente: any): Observable<any> {
      return this.http.put(`${this.apiUrl}/clientes/${id}`, cliente);
  }

  eliminarCliente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clientes/${id}`);
  }

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

  getHistorialPorPaciente(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/historias/paciente/${id}`);
  }

   agregarHistorial(historialClinico:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/historias`, historialClinico);
  }
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();  //si obtiene token true de lo contrario false
  }

  volverLogin() {
    this.router.navigate(['/login']);
  }
  getUserRole(): string | null {
  const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      // Podés loguearlo para ver la estructura exacta:
      console.log('Payload del token:', payload);

      // Usá la clave completa que contiene el rol
      return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
    } catch (e) {
      console.error('Error al decodificar token', e);
      return null;
    }
  }
}