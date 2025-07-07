import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UsuarioService } from '../../services/usuario/usuario.service';
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
 claveInvalida: boolean = false;
 passwordActual: string = '';
 nuevaPassword: string = '';
 errorPassword: string = '';
 mostrarCambioPassword: boolean = false;
 mensajeExito: string = '';

 constructor(public auth: AuthService, 
  public usuarioService:UsuarioService,
  private router: Router) {}

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
  this.usuarioService.obtenerUsuarios().subscribe({
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
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
    this.usuarioService.eliminarUsuario(id).subscribe({
      next: (res) => {
        this.obtenerUsuarios();
      },
      error: (err) => console.error('Error al eliminar usuario:', err)
    });
  }
  }
  guardarCambios() {
    this.claveInvalida = false;
    const datosParaEnviar = { ...this.usuarioSeleccionado };
 
    console.log('Datos a enviar:', datosParaEnviar);
    this.usuarioService.editarUsuario(datosParaEnviar.id, datosParaEnviar).subscribe({
    next: (res) => {
      console.log('Usuario actualizado:', res);
      this.mensajeExito = 'Usuario actualizado correctamente.'; 
       setTimeout(() => {
        this.usuarioSeleccionado = null;
        this.mensajeExito = '';

        // 🌀 Refrescar la lista si querés mantenerla sincronizada con el backend
        this.obtenerUsuarios();
      }, 1500);
    },
    error: (err) => console.error('Error al editar usuario:', err)
    });
  } 
  cambiarPassword() {
    this.errorPassword = '';

    if (!this.passwordActual || !this.nuevaPassword) {
      this.errorPassword = 'Todos los campos son obligatorios.';
        return;
      }

    if (this.nuevaPassword.length < 6) {
      this.errorPassword = 'La nueva contraseña debe tener al menos 6 caracteres.';
        return;
      }
      const email = this.auth.usuario?.email;
      if (!email) {
        this.errorPassword = 'No se pudo obtener el email del usuario.';
        return;
      }
      const cambioContrasenia = { 
        passwordActual: this.passwordActual,
        nuevaPassword: this.nuevaPassword
      };
      console.log("cambio" , cambioContrasenia, "email" ,);

      this.auth.cambiarPassword(email,cambioContrasenia).subscribe({
          next: (res) => {
            console.log('Contraseña cambiada con éxito', res);
            this.mensajeExito = 'Contraseña actualizada correctamente.'; 
              setTimeout(() => { 
              this.mensajeExito = '';
            }, 1500);
            this.passwordActual = '';
            this.nuevaPassword = '';
            this.mostrarCambioPassword = false;
          },
          error: (err) => {
            console.error('Error al cambiar contraseña', err);
            console.log('Detalles:', err.error);  
            this.errorPassword = err.error?.mensaje || 'Ocurrió un error.';
          }
        });
    }
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']); 
  }
}
