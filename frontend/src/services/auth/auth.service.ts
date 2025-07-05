import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { Router } from '@angular/router';
  
@Injectable({
  providedIn: 'root'
})
export class AuthService {

   private apiUrl = 'http://localhost:5195/api'; 
   usuario: any = null;
  constructor(private http: HttpClient , private router: Router) { }

  login(email: string , password:string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password });
  }

  cambiarPassword(email: string, cambio: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
    return this.http.put(`${this.apiUrl}/auth/usuarios/cambiar-password/${email}`, cambio, { headers });
  }
  register(nombre: string, email: string, password: string, rol: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, { nombre, email, password, rol });
  } 
  
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
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