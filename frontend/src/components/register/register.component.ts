import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { UsuarioService } from '../../services/usuario/usuario.service'; 
import { NgForm } from '@angular/forms';
 

@Component({
  selector: 'app-register',
  imports: [CommonModule,FormsModule,RouterModule],
  standalone:true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
nombre= "";
email= "";
password= "";
rol= "";
error: string | null = null;
registroExitoso: boolean = false;

constructor(public auth: AuthService, 
  public usuarioService:UsuarioService,
  private router: Router) {}


onSubmit(form: NgForm): void {
    if (form.invalid) {
    return;
  }

    this.auth.register(this.nombre, this.email,this.password, this.rol).subscribe({
      next: (res) => {
      console.log('Registrado con éxito');
      this.registroExitoso = true;
      form.resetForm(); 
      this.registroExitoso = true; 
        console.log('Usuario registrado:', res); 
      },
      error: (err) => {
        console.error('Error de register:', err); 
        this.error = err?.error?.mensaje || 'Error inesperado';
         this.registroExitoso = false;
      }
    });
  } 
    

}