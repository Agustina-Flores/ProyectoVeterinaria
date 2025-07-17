import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { Router } from '@angular/router'
import { Cliente } from '../../model/cliente.model'
import { environment } from '../../environment/environment.prod'

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrl = 'http://localhost:5195/api'; 
  constructor(private http: HttpClient , private router: Router) { }

  obtenerClientes():Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${environment.apiUrl}/clientes`);
  }
  agregarClientes(nombre: string, email: string, telefono: string): Observable<Cliente> {
    return this.http.post<Cliente>(`${environment.apiUrl}/clientes`, { nombre, email, telefono });
  }
  editarCliente(id: number, cliente: any): Observable<Cliente> {
      return this.http.put<Cliente>(`${environment.apiUrl}/clientes/${id}`, cliente);
  }
  eliminarCliente(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${environment.apiUrl}/clientes/${id}`);
  }

  volverClientes() {
    this.router.navigate(['/clientes']);
  }
}
