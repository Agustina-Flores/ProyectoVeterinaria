import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router,RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [FormsModule,CommonModule,RouterModule],
  standalone:true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  isLoggedIn = false;
  isAdmin = false;
  role: string = '';
  imagenActual  = 'assets/img/1.png'; 
  constructor(private auth: AuthService, private router: Router) {}
 

  ngOnInit(): void {
    this.isLoggedIn = this.auth.isLoggedIn(); //true si hay token
    this.role = this.auth.getUserRole() || '';
    this.isAdmin = this.role === 'Admin';
    this.obtenerImagenes();
  }
  
  obtenerImagenes(){
    let random = Math.random() * 12;
    random = Math.floor(random);
    console.log("random" , random);
    if(random !== 0){
    this.imagenActual = `assets/img/${random}.png`;
    }
  }
}
