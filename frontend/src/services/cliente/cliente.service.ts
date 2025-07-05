import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrl = 'http://localhost:5195/api'; 
  constructor(private http: HttpClient , private router: Router) { }

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

  volverClientes() {
    this.router.navigate(['/clientes']);
  }
}
