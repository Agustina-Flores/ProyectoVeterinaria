import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
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

  constructor(private auth: AuthService, private router: Router) {}
 

ngOnInit(): void {
    this.isLoggedIn = this.auth.isLoggedIn(); //true si hay token
    this.role = this.auth.getUserRole() || '';
    this.isAdmin = this.role === 'Admin';
  }
/*
  logout(): void {
    this.auth.logout();
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.router.navigate(['/login']);
  }
    */
}
