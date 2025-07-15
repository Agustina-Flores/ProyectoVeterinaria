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
  role: string = '';
  imagenActual  = 'assets/img/1.png'; 
  
  constructor(private auth: AuthService, private router: Router) {}
 

  ngOnInit(): void {
    this.isLoggedIn = this.auth.isLoggedIn();  
    this.role = this.auth.getUserRole() || '';
    this.obtenerImagenes();
  }
  
  obtenerImagenes(){
    const totalImagenes = 12;
    const random = Math.floor(Math.random() * totalImagenes) + 1;
    //console.log("random" , random);
    if(random !== 0){
    this.imagenActual = `assets/img/${random}.png`;
    }
  }
}
