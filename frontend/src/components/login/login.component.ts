import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
 import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [FormsModule, RouterModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrls:  ['./login.component.scss']
})
export class LoginComponent {
  email = "";
  password = "";
  error: string | null = null; 
  usuarioSeleccionado : any; 
 
constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        console.log('Respuesta del backend:', res); 
        this.auth.saveToken(res.token);
        this.auth.usuario = res.usuario;
        console.log('this.auth.usuario:', this.auth.usuario); 
       this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error de login:', err); 
        this.error = 'Credenciales inválidas';
      }
    });
  } 
  cancelarCambio() {
      this.usuarioSeleccionado = null; 
    }
}
