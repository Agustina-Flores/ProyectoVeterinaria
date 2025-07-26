import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Router,RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { Usuario } from '../../model/usuario.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './dashboard.component.html',  
  standalone:true,
  styleUrls: ['./dashboard.component.scss'] 
})
export class DashboardComponent {
 role: string = '';
 isAdmin = false;
 isRecepcionista=false;
 isVeterinario=false;
 isLoggedIn =false;
 usuarios: Usuario[] = [];
 usuarioSeleccionado: Usuario | null = null;
 pacienteId!: number; 
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
      this.router.navigate(['/login']); 
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
    //console.log("usuario" , this.usuarioSeleccionado);
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
    if(!this.usuarioSeleccionado)return;

    const usuarioActualizado = { ...this.usuarioSeleccionado };
  
    this.usuarioService.editarUsuario(usuarioActualizado.id, usuarioActualizado).subscribe({
    next: (res) => {
      //console.log('Usuario actualizado:', res);
      this.mensajeExito = 'Usuario actualizado correctamente.'; 
       setTimeout(() => {
        this.usuarioSeleccionado = null;
        this.mensajeExito = '';
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
      console.log("email " ,email)
      if (!email) {
        this.errorPassword = 'No se pudo obtener el email del usuario.';
        return;
      }
      const cambioContrasenia = { 
        passwordActual: this.passwordActual,
        nuevaPassword: this.nuevaPassword
      };
       console.log('Contraseña cambioContrasenia', cambioContrasenia);
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
            this.errorPassword = err.error?.mensaje || 'Ocurrió un error.';
          }
        });
  }

  logout(): void {
      this.auth.logout();
      this.router.navigate(['/login']); 
  }
}
