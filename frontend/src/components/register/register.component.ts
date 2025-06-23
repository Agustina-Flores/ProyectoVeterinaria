import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
 
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

constructor(private auth: AuthService, private router: Router) {}


onSubmit(): void {
    this.auth.register(this.nombre, this.email,this.password, this.rol).subscribe({
      next: (res) => {
        console.log('Usuario registrado:', res); 
      },
      error: (err) => {
        console.error('Error de register:', err); 
        this.error = err?.error?.mensaje || 'Error inesperado';
      }
    });
  } 
    volverLogin() {
    this.router.navigate(['/login']);
  }

}