import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router,RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './dashboard.component.html',  
  standalone:true,
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
 role: string = '';
 isAdmin = false;
 isRecepcionista=false;
 isVeterinario=false;
 isLoggedIn =false;
 usuarios: any[] = [];
  usuarioSeleccionado: any = null; 
  pacienteId!: number;

 constructor(public auth: AuthService, private router: Router) {}

   ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']); // si no está logueado, lo saco
      return;
    }
    this.isLoggedIn = this.auth.isLoggedIn();
    this.role = this.auth.getUserRole() || '';
    this.isAdmin = this.role === 'Admin';
    this.isRecepcionista = this.role === 'Recepcionista';
    this.isVeterinario = this.role === 'Veterinario';

    if (this.isAdmin) {
        this.obtenerUsuarios();
      } 
  } 
  obtenerUsuarios(): void {
  this.auth.obtenerUsuarios().subscribe({
    next: (data) => this.usuarios = data,
    error: (err) => console.error('Error al obtener usuarios:', err)
  });
  } 

  editarUsuario(usuario: any) {
    this.usuarioSeleccionado = { ...usuario }; 
    console.log("usuario" , this.usuarioSeleccionado);
  } 
  cancelarEdicion() {
    this.usuarioSeleccionado = null;
    
  }
  eliminarUsuario(id: number){
    if (confirm('¿Estás segura de que querés eliminar este usuario?')) {
    this.auth.eliminarUsuario(id).subscribe({
      next: (res) => {
        this.obtenerUsuarios();
      },
      error: (err) => console.error('Error al eliminar usuario:', err)
    });
  }
  }
  guardarCambios() {
    console.log('Datos a enviar:', this.usuarioSeleccionado);
    this.auth.editarUsuario(this.usuarioSeleccionado.id, this.usuarioSeleccionado).subscribe({
    next: (res) => {
      console.log('Usuario actualizado:', res);
      this.obtenerUsuarios(); // refrescar la lista
      this.usuarioSeleccionado = null;
    },
    error: (err) => console.error('Error al editar usuario:', err)
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']); 
  }
}
